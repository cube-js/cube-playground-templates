const R = require('ramda');
const semver = require('semver');
const traverse = require('@babel/traverse').default;
const { parse } = require('@babel/parser');

const SourceSnippet = require('./SourceSnippet');
const CssSourceSnippet = require('./CssSourceSnippet');
const CssTargetSource = require('./CssTargetSource');
const TargetSource = require('./TargetSource');
const { fileContentsRecursive } = require('./utils');

const versionRegex = /\.([0-9-]+)\.(\w+)$/;

class TemplatePackage {
  static versionGte(a, b) {
    const verA = a.replace('-', '.');
    const verB = b.replace('-', '.');
    return semver.gt(verA, verB) || verA === verB;
  }

  constructor({ appContainer, ...meta }, fileToSnippet = {}) {
    this.appContainer = appContainer;
    const {
      name,
      version,
      scaffoldingPath,
      receives,
      multiPackage = false,
    } = meta.package;

    this.name = name;
    this.version = version;
    this.scaffoldingPath = scaffoldingPath;
    this.receives = receives;
    this.multiPackage = multiPackage;
    this.children = [];
    this.fileToSnippet = fileToSnippet;
  }

  async initSources() {
    const sources = await fileContentsRecursive(
      this.scaffoldingPath,
      null,
      true
    );
    this.templateSources = sources
      .map(({ fileName, content }) => ({ [fileName]: content }))
      .reduce((a, b) => ({ ...a, ...b }), {});

    Object.keys(this.fileToSnippet).forEach((file) => {
      if (this.templateSources[file]) {
        this.fileToSnippet[file].source = this.templateSources[file];
      }
    });
  }

  mergeSources(sourceContainer, currentVersion) {
    R.uniq(
      Object.keys(this.templateSources).concat(Object.keys(this.fileToSnippet))
    )
      .filter((f) => !f.match(versionRegex))
      .forEach((scaffoldingFile) => {
        const allFiles = Object.keys(this.templateSources)
          .filter(
            (f) =>
              f.match(versionRegex) &&
              f.replace(versionRegex, '.$2') &&
              (!currentVersion ||
                TemplatePackage.versionGte(
                  currentVersion,
                  f.match(versionRegex)[1]
                ))
          )
          .concat([scaffoldingFile]);

        (allFiles.length > 1 ? R.range(2, allFiles.length + 1) : [1]).forEach(
          (toTake) => {
            const files = R.take(toTake, allFiles);
            const historySnippets = R.dropLast(1, files).map((f) =>
              this.createSourceSnippet(f, this.templateSources[f])
            );
            const lastVersionFile = files[files.length - 1];

            let targetSource = sourceContainer.getTargetSource(scaffoldingFile);

            if (!targetSource) {
              targetSource = this.createTargetSource(
                scaffoldingFile,
                this.templateSources[lastVersionFile]
              );
              sourceContainer.addTargetSource(scaffoldingFile, targetSource);
            }

            const snippet =
              this.fileToSnippet[scaffoldingFile] ||
              this.createSourceSnippet(
                scaffoldingFile,
                this.templateSources[lastVersionFile],
                historySnippets
              );

            snippet.mergeTo(targetSource);
            sourceContainer.add(scaffoldingFile, targetSource.formattedCode());
          }
        );
      });
  }

  createTargetSource(fileName, content) {
    if (fileName.match(/\.css$/)) {
      return new CssTargetSource(fileName, content);
    } else {
      return new TargetSource(fileName, content);
    }
  }

  createSourceSnippet(fileName, source, historySnippets = []) {
    if (fileName.match(/\.css$/)) {
      return new CssSourceSnippet(source);
    } else {
      return new SourceSnippet(source, historySnippets);
    }
  }

  async onBeforeApply() {}

  async onAfterApply(sourceContainer) {
    sourceContainer.addImportDependencies(this.importDependencies());
  }

  async applyPackage(sourceContainer) {
    await this.onBeforeApply();
    await this.initSources();

    const packageVersions = this.appContainer.getPackageVersions();
    if (this.multiPackage || packageVersions[this.name] !== this.version) {
      this.mergeSources(sourceContainer, packageVersions[this.name]);

      await this.appContainer.persistSources(
        sourceContainer,
        this.multiPackage ? {} : { [this.name]: this.version }
      );
    }

    await this.onAfterApply(sourceContainer);
    await this.applyChildren(sourceContainer);
  }

  async applyChildren(sourceContainer) {
    for (const [, instances] of Object.entries(this.children)) {
      for (const instance of instances) {
        await instance.applyPackage(sourceContainer);
      }
    }
  }

  importDependencies() {
    const allImports = R.toPairs(this.templateSources())
      .filter(([fileName]) => fileName.match(/\.js$/))
      .map(([fileName, content]) => {
        const imports = [];

        const ast = parse(content, {
          sourceFilename: fileName,
          sourceType: 'module',
          plugins: ['jsx'],
        });

        traverse(ast, {
          ImportDeclaration(currentPath) {
            imports.push(currentPath);
          },
        });
        return imports;
      })
      .reduce((a, b) => a.concat(b));

    const dependencies = allImports
      .filter((i) => i.get('source').node.value.indexOf('.') !== 0)
      .map((i) => {
        const importName = i.get('source').node.value.split('/');
        const dependency =
          importName[0].indexOf('@') === 0
            ? [importName[0], importName[1]].join('/')
            : importName[0];
        return this.withPeerDependencies(dependency);
      })
      .reduce((a, b) => ({ ...a, ...b }));

    return dependencies || {};
  }

  withPeerDependencies(dependency) {
    let result = {
      [dependency]: 'latest',
    };
    if (dependency === 'graphql-tag') {
      result = {
        ...result,
        graphql: 'latest',
      };
    }
    if (dependency === 'react-chartjs-2') {
      result = {
        ...result,
        'chart.js': 'latest',
      };
    }
    return result;
  }
}

module.exports = TemplatePackage;

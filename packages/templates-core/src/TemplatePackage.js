const R = require('ramda');
const semver = require('semver');
const path = require('path');

const SourceSnippet = require('./SourceSnippet');
const VueSourceSnippet = require('./VueSourceSnippet');
const CssSourceSnippet = require('./CssSourceSnippet');
const HtmlSourceSnippet = require('./HtmlSourceSnippet');
const CssTargetSource = require('./CssTargetSource');
const HtmlTargetSource = require('./HtmlTargetSource');
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

            if (targetSource === undefined) {
              targetSource = this.createTargetSource(
                scaffoldingFile,
                sourceContainer.fileContent[scaffoldingFile] ||
                  this.templateSources[lastVersionFile]
              );
              sourceContainer.addTargetSource(scaffoldingFile, targetSource);
            }

            if (scaffoldingFile.match(/\.([tj]sx?|html|css|vue)$/)) {
              const snippet =
                this.fileToSnippet[scaffoldingFile] ||
                this.createSourceSnippet(
                  scaffoldingFile,
                  this.templateSources[lastVersionFile],
                  historySnippets
                );

              snippet.mergeTo(targetSource);

              if (
                targetSource != null &&
                targetSource instanceof TargetSource
              ) {
                sourceContainer.addImportDependencies(
                  R.fromPairs(
                    targetSource
                      .getImportDependencies()
                      .map((d) => [d, 'latest'])
                  )
                );
              }

              sourceContainer.add(
                scaffoldingFile,
                targetSource.formattedCode()
              );
            } else {
              sourceContainer.addFileToMove(
                path.join(this.scaffoldingPath, scaffoldingFile),
                scaffoldingFile
              );
            }
          }
        );
      });
  }

  createTargetSource(fileName, content) {
    if (fileName.match(/\.css$/)) {
      return new CssTargetSource(fileName, content);
    } else if (fileName.match(/\.html$/)) {
      return new HtmlTargetSource(fileName, content);
    } else if (fileName.match(/\.([jt]s|vue)$/)) {
      return new TargetSource(fileName, content);
    }

    return null;
  }

  createSourceSnippet(fileName, source, historySnippets = []) {
    if (fileName.match(/\.html$/)) {
      return new HtmlSourceSnippet(source);
    } else if (fileName.match(/\.css$/)) {
      return new CssSourceSnippet(source);
    } else if (fileName.match(/\.vue$/)) {
      return new VueSourceSnippet(source, historySnippets);
    }

    return new SourceSnippet(source, historySnippets);
  }

  async onBeforeApply() {}

  async onBeforePersist(sourceContainer) {}

  async onAfterApply(sourceContainer) {
    sourceContainer.addImportDependencies(this.importDependencies());
    sourceContainer.addImportDependencies(
      Object.keys(sourceContainer.importDependencies)
        .map((dependency) => this.withPeerDependencies(dependency))
        .reduce((a, b) => ({ ...a, ...b }), {})
    );
  }

  async applyPackage(sourceContainer) {
    await this.onBeforeApply();
    await this.initSources();

    const packageVersions = this.appContainer.getPackageVersions();
    if (this.multiPackage || packageVersions[this.name] !== this.version) {
      this.mergeSources(sourceContainer, packageVersions[this.name]);

      await this.onBeforePersist(sourceContainer);
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
    return {};
  }

  withPeerDependencies(dependency) {
    if (dependency === 'graphql-tag') {
      return {
        graphql: 'latest',
      };
    }

    if (dependency === 'react-chartjs-2') {
      return {
        'chart.js': '^3.4.0',
      };
    }

    return {};
  }
}

module.exports = TemplatePackage;

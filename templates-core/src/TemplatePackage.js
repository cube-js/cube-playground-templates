const R = require('ramda');
const semver = require('semver');

const SourceSnippet = require('./SourceSnippet');
const CssSourceSnippet = require('./CssSourceSnippet');
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
    } = meta.package;
    
    this.name = name;
    this.version = version;
    this.scaffoldingPath = scaffoldingPath;
    this.receives = receives;
    this.multiPackage = false;
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

            sourceContainer.mergeSnippetToFile(
              this.fileToSnippet[scaffoldingFile] ||
                this.createSourceSnippet(
                  scaffoldingFile,
                  this.templateSources[lastVersionFile],
                  historySnippets
                ),
              scaffoldingFile,
              this.templateSources[lastVersionFile]
            );
          }
        );
      });
  }

  createSourceSnippet(fileName, source, historySnippets) {
    if (fileName.match(/\.css$/)) {
      return new CssSourceSnippet(source);
    } else {
      return new SourceSnippet(source, historySnippets);
    }
  }

  async onBeforeApply() {}

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

    await this.applyChildren(sourceContainer);
  }

  async applyChildren(sourceContainer) {
    for (const [, instances] of Object.entries(this.children)) {
      for (const instance of instances) {
        await instance.applyPackage(sourceContainer);  
      }
    }
  }
}

module.exports = TemplatePackage;

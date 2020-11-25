const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const prettier = require('prettier');

class TargetSource {
  constructor(fileName, source) {
    this.source = source;
    this.fileName = fileName;
    try {
      this.ast = parse(source, {
        sourceFilename: fileName,
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy'],
      });
    } catch (e) {
      throw new Error(`Can't parse ${fileName}: ${e.message}`);
    }
    this.findAllImports();
    this.findAllDefinitions();
    this.findDefaultExport();
  }

  findAllImports() {
    this.imports = [];
    traverse(this.ast, {
      ImportDeclaration: (path) => {
        this.imports.push(path);
      },
    });
  }

  findDefaultExport() {
    traverse(this.ast, {
      ExportDefaultDeclaration: (path) => {
        if (path) {
          this.defaultExport = path;
        }
      },
    });
  }

  findAllDefinitions() {
    this.definitions = [];
    traverse(this.ast, {
      VariableDeclaration: (path) => {
        if (path.parent.type === 'Program') {
          this.definitions.push(...path.get('declarations'));
        }
      },
      FunctionDeclaration: (path) => {
        if (path.parent.type === 'Program') {
          this.definitions.push(path);
        }
      },
    });
  }

  code() {
    return (
      (this.ast && generator(this.ast, {}, this.source).code) || this.source
    );
  }

  formattedCode() {
    return TargetSource.formatCode(this.code());
  }

  getImportDependencies() {
    return this.imports
      .filter((i) => i.get('source').node.value.indexOf('.') !== 0)
      .map((i) => {
        const importName = i.get('source').node.value.split('/');
        const dependency =
          importName[0].indexOf('@') === 0
            ? [importName[0], importName[1]].join('/')
            : importName[0];
        return dependency;
      });
  }

  static formatCode(code) {
    try {
      return prettier.format(code, {
        parser: 'babel',
        singleQuote: true,
      });
    } catch (error) {
      console.warn('prettier error');
      return code;
    }
  }
}

module.exports = TargetSource;

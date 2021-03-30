const traverse = require('@babel/traverse').default;

const SourceSnippet = require('./SourceSnippet');
const VueSourceSnippet = require('./VueSourceSnippet');

class TargetSource {
  constructor(fileName, source) {
    this.snippet = null;
    this.imports = [];
    this.definitions = [];

    this.source = source;
    this.fileName = fileName;

    this.parseSourceCode();

    if (this.snippet && this.ast) {
      this.findAllImports();
      this.findAllDefinitions();
      this.findDefaultExport();
    }
  }

  get ast() {
    return this.snippet.ast;
  }

  parseSourceCode() {
    if (this.fileName.endsWith('.vue')) {
      this.snippet = new VueSourceSnippet(this.source);
    } else if (this.fileName.match(/\.([tj]sx?)$/)) {
      this.snippet = new SourceSnippet(this.source);
    } else {
      console.log(`Skip parsing '${this.fileName}'. No parser found.`);
    }
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
    return this.snippet.source;
  }

  formattedCode() {
    return SourceSnippet.formatCode(
      this.code(),
      this.fileName.match(/\.(tsx?)$/) ? 'typescript' : 'babel'
    );
  }

  getImportDependencies() {
    return this.imports
      .filter((i) => {
        const { value } = i.get('source').node;
        if (value.startsWith('.') || value.startsWith('@/')) {
          return false;
        }

        return true;
      })
      .map((i) => {
        const importName = i.get('source').node.value.split('/');
        const dependency =
          importName[0].indexOf('@') === 0
            ? [importName[0], importName[1]].join('/')
            : importName[0];
        return dependency;
      });
  }
}

module.exports = TargetSource;

const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const SourceSnippet = require('./SourceSnippet');

class VueMainSnippet extends SourceSnippet {
  mergeTo(targetSource) {
    super.mergeTo(targetSource);
    this.extractPlugins(targetSource);
  }

  extractPlugins(targetSource) {
    const vuePlugins = [];
    traverse(this.ast, {
      CallExpression: (path) => {
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.object) &&
          t.isIdentifier(path.node.callee.property)
        ) {
          if (
            path.node.callee.object.name === 'Vue' &&
            path.node.callee.property.name === 'use'
          ) {
            vuePlugins.push(path.node);
          }
        }
      },
    });

    traverse(targetSource.ast, {
      CallExpression: (path) => {
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isNewExpression(path.node.callee.object) &&
          t.isIdentifier(path.node.callee.object.callee) &&
          path.node.callee.object.callee.name === 'Vue'
        ) {
          path.insertBefore(vuePlugins);
        }
      },
    });

    let targetPropertiesRef = null;
    const optionsArgSet = new Set();

    this.traverseVueOptions(targetSource.ast, (node) => {
      const [optionsArg] = node.arguments;
      if (optionsArg && t.isObjectExpression(optionsArg)) {
        targetPropertiesRef = optionsArg.properties;
        optionsArg.properties.forEach((node) => {
          optionsArgSet.add(SourceSnippet.astToCode(node));
        });
      }
    });

    this.traverseVueOptions(this.ast, (node) => {
      const [optionsArg] = node.arguments;
      if (optionsArg && t.isObjectExpression(optionsArg)) {
        optionsArg.properties.forEach((prop) => {
          if (!optionsArgSet.has(SourceSnippet.astToCode(prop))) {
            targetPropertiesRef.push(prop);
          }
        });
      }
    });
  }

  traverseVueOptions(ast, cb) {
    traverse(ast, {
      CallExpression: (path) => {
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isNewExpression(path.node.callee.object) &&
          t.isIdentifier(path.node.callee.object.callee) &&
          path.node.callee.object.callee.name === 'Vue'
        ) {
          cb(path.node.callee.object);
        }
      },
    });
  }
}

module.exports = VueMainSnippet;

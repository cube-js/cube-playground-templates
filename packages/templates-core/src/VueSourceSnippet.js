const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const SourceSnippet = require('./SourceSnippet');

class VueSourceSnippet extends SourceSnippet {
  static parseTagContent(tagName, content, preserveWrapper = false) {
    const regex = new RegExp(
      `<${tagName}[^>]{0,}>([\\s\\S]+)<\/${tagName}>`,
      'gm'
    );
    const match = regex.exec(content || '');
    const index = preserveWrapper ? 0 : 1;

    return (match && match[index]) || '';
  }

  constructor(source = null, historySnippets = []) {
    super(VueSourceSnippet.parseTagContent('script', source), historySnippets);

    this.scriptSource = null;

    if (source) {
      this.templateSource = VueSourceSnippet.parseTagContent(
        'template',
        source
      );
      this.styleSource = VueSourceSnippet.parseTagContent(
        'style',
        source,
        true
      );
    }
  }

  get source() {
    const scriptSource = generator(
      this.ast,
      {
        decoratorsBeforeExport: true,
      },
      this.sourceValue
    ).code;

    const chunks = [];

    if (this.templateSource) {
      chunks.push(`<template>${this.templateSource}</template>`);
    }
    if (scriptSource) {
      chunks.push(`<script>${scriptSource}</script>`);
    }
    if (this.styleSource) {
      chunks.push(this.styleSource);
    }

    return chunks.join('\n');
  }

  set source(source) {
    if (!source) {
      throw new Error('Empty source is provided');
    }

    this.sourceValue = source;
    this.ast = SourceSnippet.parse(source);
  }

  mergeTo(targetSource) {
    super.mergeTo(targetSource);

    if (!targetSource.snippet.templateSource && this.templateSource) {
      targetSource.snippet.templateSource = this.templateSource;
      // todo: refactor
      targetSource.snippet.ast = this.ast;
    }

    this.mergeExportOptions(targetSource);
  }

  mergeExportOptions(targetSource) {
    const mergeKeys = ['methods', 'components', 'computed'];
    const identifiersByKeys = {
      methods: new Map(),
      components: new Map(),
      computed: new Map(),
    };

    traverse(this.ast, {
      ObjectExpression(path) {
        if (
          path.parent &&
          t.isIdentifier(path.parent.key) &&
          mergeKeys.includes(path.parent.key.name)
        ) {
          const { name } = path.parent.key;
          path.node.properties.forEach((p) => {
            identifiersByKeys[name].set(p.key.name, p);
          });
        }
      },
    });

    traverse(targetSource.ast, {
      ObjectExpression(path) {
        if (
          path.parent &&
          t.isIdentifier(path.parent.key) &&
          mergeKeys.includes(path.parent.key.name)
        ) {
          const { name } = path.parent.key;
          const existingKeys = new Set();
          path.node.properties.forEach((p) => {
            if (identifiersByKeys[name].has(p.key.name)) {
              existingKeys.add(p.key.name);
              // throw new Error(
              //   `Both targets contain '${p.key.name}' prop which is not supported.`
              // );
            }
          });

          for (const [, node] of identifiersByKeys[name].entries()) {
            if (!existingKeys.has(node.key.name)) {
              path.node.properties.push(node);
            }
          }
        }
      },
    });
  }
}

module.exports = VueSourceSnippet;

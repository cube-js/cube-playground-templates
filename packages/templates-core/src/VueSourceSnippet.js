const generator = require('@babel/generator').default;

const SourceSnippet = require('./SourceSnippet');

class VueSourceSnippet extends SourceSnippet {
  scriptSource = null;

  templateSource = null;

  styleSource = null;

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
}

module.exports = VueSourceSnippet;

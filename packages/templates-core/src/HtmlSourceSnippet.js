class HtmlSourceSnippet {
  constructor(source) {
    this.source = source;
  }

  mergeTo(targetSource) {
    if (!targetSource.source) {
      targetSource.source = this.source;
    }
  }
}

module.exports = HtmlSourceSnippet;

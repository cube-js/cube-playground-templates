class HtmlTargetSource {
  constructor(fileName, source) {
    this.source = source;
    this.fileName = fileName;
  }

  formattedCode() {
    return this.source;
  }
}

module.exports = HtmlTargetSource;

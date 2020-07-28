const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('../../templates-core');

class ReactAntdStaticTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ReactAntdStaticTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

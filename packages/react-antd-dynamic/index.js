const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-templates/core');

class ReactAntdDynamicTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ReactAntdDynamicTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

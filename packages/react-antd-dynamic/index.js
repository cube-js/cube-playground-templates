const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-playground/core');

class ReactAntdDynamicTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ReactAntdDynamicTemplate({
    ...context,
    fileToSnippet: {
      '/src/App.js': new AppSnippet(),
      '/src/index.js': new IndexSnippet(),
    },
  });

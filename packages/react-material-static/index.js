const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-templates/core');

class ReactMaterialStaticTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ReactMaterialStaticTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

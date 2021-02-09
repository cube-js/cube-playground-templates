const { TemplatePackage, AppSnippet } = require('@cubejs-templates/core');

class ReactChartsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ReactChartsTemplate(context, {
    '/src/App.js': new AppSnippet(),
  });

const { TemplatePackage, VueMainSnippet } = require('@cubejs-templates/core');

class VueChartjsChartsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new VueChartjsChartsTemplate(context, {
    '/src/main.js': new VueMainSnippet(),
  });

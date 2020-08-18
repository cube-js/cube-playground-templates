const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class RechartsChartsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new RechartsChartsTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

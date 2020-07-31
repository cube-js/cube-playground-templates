const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class RechartsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new RechartsTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

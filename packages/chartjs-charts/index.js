const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('../../templates-core');

class ChartjsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ChartjsTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

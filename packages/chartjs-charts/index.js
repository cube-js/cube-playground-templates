const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-playground/core');

class ChartjsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new ChartjsTemplate({
    ...context,
    fileToSnippet: {
      '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
    },
  });

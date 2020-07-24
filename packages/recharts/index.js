const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-playground/core');

class RechartsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new RechartsTemplate({
    ...context,
    fileToSnippet: {
      '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
    },
  });

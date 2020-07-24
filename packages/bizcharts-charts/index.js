const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-playground/core');

class BizchartTemplate extends TemplatePackage {}

module.exports = (context) =>
  new BizchartTemplate({
    ...context,
    fileToSnippet: {
      '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
    },
  });

const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-playground/core');

class AntdTablesTemplate extends TemplatePackage {}

module.exports = (context) =>
  new AntdTablesTemplate({
    ...context,
    fileToSnippet: {
      '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
    },
  });

const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('../../templates-core');

class AntdTablesTemplate extends TemplatePackage {}

module.exports = (context, t) =>
  new AntdTablesTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class AntdTablesTemplate extends TemplatePackage {}

module.exports = (context) =>
  new AntdTablesTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

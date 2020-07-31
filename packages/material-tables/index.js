const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class MaterialTablesTemplate extends TemplatePackage {}

module.exports = (context) =>
  new MaterialTablesTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

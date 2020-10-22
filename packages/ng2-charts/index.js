const {
  TemplatePackage,
  QueryRendererSnippet,
} = require('@cubejs-templates/core');

class Ng2ChartsTemplate extends TemplatePackage {}

module.exports = (context) =>
  new Ng2ChartsTemplate(context, {
    '/src/app/dashboard/query-renderer/query-renderer.component.ts': new QueryRendererSnippet(),
  });

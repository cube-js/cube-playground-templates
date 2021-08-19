const {
  TemplatePackage,
  QueryRendererSnippet,
} = require('@cubejs-templates/core');

class Ng2ChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'chart.js': '^2.9.4',
    };
  }
}

module.exports = (context) =>
  new Ng2ChartsTemplate(context, {
    '/src/app/explore/query-renderer/query-renderer.component.ts': new QueryRendererSnippet(),
  });

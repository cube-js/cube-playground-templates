const {
  TemplatePackage,
  QueryRendererSnippet,
} = require('@cubejs-templates/core');

class Ng2ChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'chart.js': '3.7.0',
      'ng2-charts': '3.0.6',
    };
  }
}

module.exports = (context) =>
  new Ng2ChartsTemplate(context, {
    '/src/app/explore/query-renderer/query-renderer.component.ts': new QueryRendererSnippet(),
  });

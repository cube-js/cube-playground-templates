const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class RechartsChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      recharts: '2.0.0-beta.8',
    };
  }
}

module.exports = (context) =>
  new RechartsChartsTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

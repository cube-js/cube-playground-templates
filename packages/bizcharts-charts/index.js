const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class BizchartTemplate extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      bizcharts: '4.1.7',
    };
  }
}

module.exports = (context) =>
  new BizchartTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

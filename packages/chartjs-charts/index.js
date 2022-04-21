const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class ChartjsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'react-chartjs-2': '^3.0.3',
      'chart.js': '^3.4.0',
    };
  }
}

module.exports = (context) =>
  new ChartjsTemplate(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

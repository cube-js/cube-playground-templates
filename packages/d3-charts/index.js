const {
  TemplatePackage,
  ChartRendererSnippet,
} = require('@cubejs-templates/core');

class D3Template extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      d3: '6.5.0',
    };
  }
}

module.exports = (context) =>
  new D3Template(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

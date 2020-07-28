const {
  TemplatePackage,
  ChartRendererSnippet
} = require('../../templates-core');

class D3Template extends TemplatePackage {}

module.exports = (context) =>
  new D3Template(context, {
    '/src/components/ChartRenderer.js': new ChartRendererSnippet(),
  });

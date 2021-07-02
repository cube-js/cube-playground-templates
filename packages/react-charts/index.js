const { TemplatePackage, AppSnippet } = require('@cubejs-templates/core');

class ReactChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'react-chartjs-2': '^3.0.3',
      'chart.js': '^3.4.0',
    };
  }
}

module.exports = (context) =>
  new ReactChartsTemplate(context, {
    '/src/App.js': new AppSnippet(),
  });

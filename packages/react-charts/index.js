const { TemplatePackage, AppSnippet } = require('@cubejs-templates/core');

class ReactChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'react-chartjs-2': '^2.11.2',
    };
  }
}

module.exports = (context) =>
  new ReactChartsTemplate(context, {
    '/src/App.js': new AppSnippet(),
  });

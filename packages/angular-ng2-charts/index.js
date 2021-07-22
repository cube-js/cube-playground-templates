const { TemplatePackage } = require('@cubejs-templates/core');

class Ng2ChartsLibraryTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'chart.js': '^2.9.4',
    };
  }
}

module.exports = (context) => new Ng2ChartsLibraryTemplate(context);

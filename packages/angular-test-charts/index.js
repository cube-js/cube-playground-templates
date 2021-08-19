const { TemplatePackage } = require('@cubejs-templates/core');

class TestChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'chart.js': '^2.9.4',
    };
  }
}

module.exports = (context) => new TestChartsTemplate(context);

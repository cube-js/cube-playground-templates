const { TemplatePackage } = require('@cubejs-templates/core');

class TestChartsTemplate extends TemplatePackage {}

module.exports = (context) => new TestChartsTemplate(context);

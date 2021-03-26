const { TemplatePackage } = require('@cubejs-templates/core');

class VueChartingLibraryTemplate extends TemplatePackage {}

module.exports = (context) => new VueChartingLibraryTemplate(context);

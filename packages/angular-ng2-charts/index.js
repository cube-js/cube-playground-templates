const { TemplatePackage } = require('@cubejs-templates/core');

class Ng2ChartsLibraryTemplate extends TemplatePackage {}

module.exports = (context) => new Ng2ChartsLibraryTemplate(context);

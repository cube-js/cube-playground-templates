const { TemplatePackage } = require('@cubejs-templates/core');

class NgMaterialDynamicTemplate extends TemplatePackage {}

module.exports = (context) => new NgMaterialDynamicTemplate(context);

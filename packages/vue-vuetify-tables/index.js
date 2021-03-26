const { TemplatePackage } = require('@cubejs-templates/core');

class VueVuetifyTablesTemplate extends TemplatePackage {}

// todo: VueTableRendererSnippet

module.exports = (context) => new VueVuetifyTablesTemplate(context);

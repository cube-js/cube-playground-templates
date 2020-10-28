const { TemplatePackage } = require('@cubejs-templates/core');

class NgMaterialDynamicTemplate extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      '@apollo/client': 'latest',
      graphql: 'latest',
      'graphql-tools': '5.0.0',
    };
  }
}

module.exports = (context) => new NgMaterialDynamicTemplate(context);

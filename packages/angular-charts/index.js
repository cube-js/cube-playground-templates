const {
  TemplatePackage,
  // CredentialsSnippet,
} = require('@cubejs-templates/core');

class AngularChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      '@angular/cdk': 'latest',
    };
  }
}

module.exports = (context) => {
  if (!context.playgroundContext) {
    throw new Error('"playgroundContext" is required');
  }

  return new AngularChartsTemplate(context);
};

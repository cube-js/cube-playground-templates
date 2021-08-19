const {
  TemplatePackage,
  // CredentialsSnippet,
} = require('@cubejs-templates/core');

class AngularChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      '@angular/animations': '~10.2.4',
      '@angular/material': '~10.2.4',
      '@angular/cdk': '~10.2.4',
      'ngx-spinner': '^10.0.1',
      'chart.js': '^2.9.4',
    };
  }
}

module.exports = (context) => {
  if (!context.playgroundContext) {
    throw new Error('"playgroundContext" is required');
  }

  return new AngularChartsTemplate(context);
};

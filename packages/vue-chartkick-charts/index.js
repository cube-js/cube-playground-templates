const { TemplatePackage, VueMainSnippet } = require('@cubejs-templates/core');

class VueChartkickChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'vue-chartkick': '^0.6.0',
    };
  }
}

module.exports = (context) =>
  new VueChartkickChartsTemplate(context, {
    '/src/main.js': new VueMainSnippet(),
  });

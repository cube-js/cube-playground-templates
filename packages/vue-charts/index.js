const { TemplatePackage, VueMainSnippet } = require('@cubejs-templates/core');

class VueChartsTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'vue-cli-plugin-vuetify': '~2.0.6',
      'vuetify-loader': '^1.3.0',
    };
  }
}

module.exports = (context) =>
  new VueChartsTemplate(context, {
    '/src/main.js': new VueMainSnippet(),
  });

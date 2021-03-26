const { TemplatePackage } = require('@cubejs-templates/core');

class VueVuetifyDynamicTemplate extends TemplatePackage {
  importDependencies() {
    return {
      sass: '^1.19.0',
      'sass-loader': '^8.0.0',
      'vue-cli-plugin-vuetify': '~2.0.6',
      'vuetify-loader': '^1.3.0',
    };
  }
}

module.exports = (context) => new VueVuetifyDynamicTemplate(context);

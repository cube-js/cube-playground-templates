const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-templates/core');

class ReactAntdDynamicTemplate extends TemplatePackage {
  importDependencies() {
    console.log('ReactAntdDynamicTemplate.importDependencies');
    return {
      ...super.importDependencies(),
      'graphql-tools': '^5.0.0',
    };
  }
}

module.exports = (context) =>
  new ReactAntdDynamicTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

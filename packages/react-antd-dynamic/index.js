const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-templates/core');

class ReactAntdDynamicTemplate extends TemplatePackage {
  importDependencies() {
    return {
      graphql: 'latest',
      'graphql-tools': '5.0.0',
      'react-router': '5.2.1',
    };
  }
}

module.exports = (context) =>
  new ReactAntdDynamicTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

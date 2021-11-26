const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-templates/core');

class ReactAntdDynamicTemplate extends TemplatePackage {
  importDependencies() {
    return {
      graphql: '15.7.2',
      'graphql-tools': '5.0.0',
      'react-router': '5.2.1',
      'react-router-dom': '5.2.1',
      '@apollo/react-hooks': '3.1.3',
    };
  }
}

module.exports = (context) =>
  new ReactAntdDynamicTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

const {
  TemplatePackage,
  AppSnippet,
  IndexSnippet,
} = require('@cubejs-templates/core');

class ReactAntdStaticTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'react-router': '5.2.1',
      'react-router-dom': '5.2.1',
    };
  }
}

module.exports = (context) =>
  new ReactAntdStaticTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/index.js': new IndexSnippet(),
  });

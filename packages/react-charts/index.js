const {
  TemplatePackage,
  CredentialsSnippet,
  AppSnippet,
} = require('@cubejs-templates/core');

class ReactChartsTemplate extends TemplatePackage {}

module.exports = (context) => {
  if (!context.playgroundContext) {
    throw new Error('"playgroundContext" is required');
  }

  return new ReactChartsTemplate(context, {
    '/src/App.js': new AppSnippet(),
    '/src/ChartContainer.js': new CredentialsSnippet(
      context.playgroundContext.credentials
    ),
  });
};

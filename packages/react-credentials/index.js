const {
  TemplatePackage,
  CredentialsSnippet,
} = require('@cubejs-templates/core');

class AppCredentialsTemplate extends TemplatePackage {}

module.exports = (context) => {
  if (!context.playgroundContext) {
    throw new Error('"playgroundContext" is required');
  }

  return new AppCredentialsTemplate(context, {
    '/src/App.js': new CredentialsSnippet(
      context.playgroundContext.credentials
    ),
  });
};

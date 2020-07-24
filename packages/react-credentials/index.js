const {
  TemplatePackage,
  CredentialsSnippet,
} = require('@cubejs-playground/core');

class AppCredentialsTemplate extends TemplatePackage {}

module.exports = (context) => {
  if (!context.playgroundContext) {
    throw new Error('"playgroundContext" is required');
  }

  return new AppCredentialsTemplate({
    ...context,
    fileToSnippet: {
      '/src/App.js': new CredentialsSnippet(
        context.playgroundContext.credentials
      ),
    },
  });
};

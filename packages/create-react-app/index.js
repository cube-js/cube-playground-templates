const { TemplatePackage } = require('../templates-core');

class CreateReactAppTemplate extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      react: '16.14.0',
      'react-dom': '16.14.0',
    };
  }

  async onBeforeApply() {
    const isInstalled = this.appContainer.getPackageVersions()[this.name];

    if (!isInstalled) {
      try {
        await this.appContainer.executeCommand('npx', [
          'create-react-app',
          this.appContainer.appPath,
          '--use-npm',
        ]);
      } catch (error) {
        if (error.toString().indexOf('ENOENT') !== -1) {
          throw new Error(
            `npx is not installed. Please update your npm: \`$ npm install -g npm\`.`
          );
        }

        // create-react-app may be installed globally, let's try
        await this.appContainer.executeCommand('create-react-app', [
          this.appContainer.appPath,
          '--use-npm',
        ]);
      }
    }
  }

  async onBeforePersist(sourceContainer) {
    sourceContainer.fileContent['.env'] = 'SKIP_PREFLIGHT_CHECK=true';
  }
}

module.exports = (context) => new CreateReactAppTemplate(context);

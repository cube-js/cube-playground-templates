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
      await this.appContainer
        .executeCommand('npx', [
          'create-react-app',
          this.appContainer.appPath,
          '--use-npm',
        ])
        .catch((e) => {
          if (e.toString().indexOf('ENOENT') !== -1) {
            throw new Error(
              `npx is not installed. Please update your npm: \`$ npm install -g npm\`.`
            );
          }
          throw e;
        });
    }
  }
}

module.exports = (context) => new CreateReactAppTemplate(context);

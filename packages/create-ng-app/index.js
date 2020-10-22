const { TemplatePackage } = require('../templates-core');

class CreateNgAppTemplate extends TemplatePackage {
  async onBeforeApply() {
    const isInstalled = this.appContainer.getPackageVersions()[this.name];

    if (!isInstalled) {
      await this.appContainer
        .executeCommand('npx', [
          'ng',
          'n',
          this.appContainer.appPath,
          '--routing=false',
          '--style=css',
          '--minimal=true',
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

module.exports = (context) => new CreateNgAppTemplate(context);

const { TemplatePackage } = require('../templates-core');
const path = require('path');

class CreateNgAppTemplate extends TemplatePackage {
  importDependencies() {
    return {
      ...super.importDependencies(),
      'node-sass': '^5.0.0',
      sass: '^1.32.8',
      'sass-loader': '^10.1.1',
    };
  }

  async onBeforeApply() {
    const isInstalled = this.appContainer.getPackageVersions()[this.name];

    if (!isInstalled) {
      await this.appContainer
        .executeCommand(
          // todo: uncomment
          // `npx @vue/cli create -m npm -n -d ${path.basename(
          //   this.appContainer.appPath
          // )}`,
          `vue create -m npm -n -d ${path.basename(this.appContainer.appPath)}`,
          [],
          {
            cwd: path.dirname(this.appContainer.appPath),
            shell: true,
          }
        )
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

  async onAfterApply() {
    const appPath = path.resolve(this.appContainer.appPath);

    try {
      await this.appContainer.executeCommand(
        'rm src/components/HelloWorld.vue 2> /dev/null',
        [],
        {
          cwd: appPath,
          shell: true,
        }
      );
      await this.appContainer.executeCommand('rm src/main.js', [], {
        cwd: appPath,
        shell: true,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = (context) => new CreateNgAppTemplate(context);

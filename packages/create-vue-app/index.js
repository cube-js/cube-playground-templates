const path = require('path');
const fs = require('fs-extra');

const { TemplatePackage } = require('../templates-core');

class CreateNgAppTemplate extends TemplatePackage {
  importDependencies() {
    return {
      'node-sass': '^5.0.0',
      sass: '^1.32.8',
      'sass-loader': '^10.1.1',
    };
  }

  async onBeforeApply() {
    const isInstalled = this.appContainer.getPackageVersions()[this.name];

    if (!isInstalled) {
      try {
        await this.appContainer.executeCommand(
          `npx @vue/cli create -m npm -n -d ${path.basename(
            this.appContainer.appPath
          )}`,
          [],
          {
            cwd: path.dirname(this.appContainer.appPath),
            shell: true,
          }
        );
      } catch (error) {
        if (error.toString().indexOf('ENOENT') !== -1) {
          throw new Error(
            `npx is not installed. Please update your npm: \`$ npm install -g npm\`.`
          );
        }
        throw error;
      }
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

  async onBeforePersist() {
    const packageJsonPath = path.join(
      this.appContainer.appPath,
      'package.json'
    );

    const json = fs.readJsonSync(packageJsonPath);
    json.scripts.start = 'vue-cli-service serve';

    fs.writeFileSync(packageJsonPath, JSON.stringify(json));
  }
}

module.exports = (context) => new CreateNgAppTemplate(context);

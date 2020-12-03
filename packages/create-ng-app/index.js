const { TemplatePackage } = require('../templates-core');
const fs = require('fs-extra');
const path = require('path');

class CreateNgAppTemplate extends TemplatePackage {
  async onBeforeApply() {
    const isInstalled = this.appContainer.getPackageVersions()[this.name];

    if (!isInstalled) {
      // await this.appContainer.executeCommand(
      //   'cd',
      //   path.dirname(this.appContainer.appPath)
      // );
      await this.appContainer
        .executeCommand(
          'npx',
          [
            '@angular/cli',
            'n',
            path.basename(this.appContainer.appPath),
            '--routing=false',
            '--style=css',
            '--minimal=true',
            '--packageManager=npm',
            '--strict=false',
          ],
          {
            cwd: path.dirname(this.appContainer.appPath),
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
      // await this.appContainer.executeCommand('cd', '-');
    }
  }

  async onAfterApply() {
    const appPath = path.resolve(this.appContainer.appPath);
    const content = fs.readFileSync(`${appPath}/tsconfig.json`, 'utf-8');

    if (content) {
      try {
        const json = JSON.parse(content.replace(/\/\*(.*)\*\//, ''));
        json.compilerOptions.allowSyntheticDefaultImports = true;
        fs.writeFileSync(
          `${appPath}/tsconfig.json`,
          JSON.stringify(json, null, 2)
        );
      } catch (error) {
        console.error(`Cannot parse 'tsconfig.json`, error);
      }
    }
  }
}

module.exports = (context) => new CreateNgAppTemplate(context);

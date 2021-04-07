const { spawnSync } = require('child_process');

const { TemplatePackage } = require('../templates-core');

class CreateReactAppTemplate extends TemplatePackage {
  importDependencies() {
    return {
      react: '16.14.0',
      'react-dom': '16.14.0',
    };
  }

  async onBeforeApply() {
    const isInstalled = this.appContainer.getPackageVersions()[this.name];

    if (!isInstalled) {
      try {
        await this.appContainer.executeCommand('npx', [
          // '-y',
          'create-react-app@4.0.3',
          this.appContainer.appPath,
          '--use-npm',
        ]);
      } catch (error) {
        if (error.toString().indexOf('ENOENT') !== -1) {
          throw new Error(
            `npx is not installed. Please update your npm: \`$ npm install -g npm\`.`
          );
        }

        const child1 = spawnSync('create-react-app --version', { shell: true });
        const child2 = spawnSync('npm view create-react-app version', {
          shell: true,
        });

        if (
          child1.stdout.toString() !== '' &&
          child2.stdout.toString() !== child1.stdout.toString()
        ) {
          throw new Error(
            'Create React App does not longer support global installation.\n\n' +
              'Please remove any global installs with one of the following commands:\n' +
              '- npm uninstall -g create-react-app\n' +
              '- yarn global remove create-react-app\n\n'
          );
        }
      }
    }
  }

  async onBeforePersist(sourceContainer) {
    sourceContainer.fileContent['.env'] = 'SKIP_PREFLIGHT_CHECK=true';
  }
}

module.exports = (context) => new CreateReactAppTemplate(context);

const { TemplatePackage } = require('@cubejs-templates/core');

class DevCraTemplate extends TemplatePackage {
  async onBeforeApply() {
    try {
      await this.appContainer.executeCommand('cp', [
        '-R',
        `${__dirname}/scaffolding`,
        this.appContainer.appPath,
      ]);
    } catch (e) {
      if (e.toString().indexOf('ENOENT') !== -1) {
        throw new Error(
          `npx is not installed. Please update your npm: \`$ npm install -g npm\`.`
        );
      }
      throw e;
    }
  }
}

module.exports = (context) => new DevCraTemplate(context);

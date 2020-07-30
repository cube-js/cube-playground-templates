const { TemplatePackage } = require('@cubejs-templates/core');

class WebSocketTransportTemplate extends TemplatePackage {}

module.exports = (context) => new WebSocketTransportTemplate(context);

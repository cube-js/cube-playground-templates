const { TemplatePackage } = require('@cubejs-playground/core');

class WebSocketTransportTemplate extends TemplatePackage {}

module.exports = (context) => new WebSocketTransportTemplate(context);

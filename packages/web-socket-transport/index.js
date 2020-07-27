const { TemplatePackage } = require('../../templates-core');

class WebSocketTransportTemplate extends TemplatePackage {}

module.exports = (context) => new WebSocketTransportTemplate(context);

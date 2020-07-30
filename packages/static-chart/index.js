const { TemplatePackage, ChartSnippet } = require('@cubejs-templates/core');

class StaticChartTemplate extends TemplatePackage {}

module.exports = (context) => {
  const { chartCode } = context.playgroundContext;

  if (!chartCode) {
    throw new Error(`playgroundContext misses required chartCode`);
  }

  return new StaticChartTemplate(context, {
    '/src/pages/DashboardPage.js': new ChartSnippet(chartCode),
  });
};

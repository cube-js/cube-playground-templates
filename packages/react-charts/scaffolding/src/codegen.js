import * as bizchartsCharts from './bizcharts-charts/src/code-chunks';
import * as rechartsCharts from './recharts-charts/src/code-chunks';
import * as chartjsCharts from './chartjs-charts/src/code-chunks';
import * as d3Charts from './d3-charts/src/code-chunks';

const chunksByLibrary = {
  bizchartsCharts,
  rechartsCharts,
  chartjsCharts,
  d3Charts,
};

const commonDependencies = [
  'react-dom',
  '@cubejs-client/core',
  '@cubejs-client/react',
  'antd',
];

export function getCodesandboxFiles(
  chartingLibrary,
  { query, pivotConfig, chartType, cubejsToken, apiUrl }
) {
  const { getCommon, getImports, getChartComponent } = chunksByLibrary[
    `${chartingLibrary}Charts`
  ];

  return {
    'index.js': `import ReactDOM from 'react-dom';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
${getImports().join('\n')}

${getCommon()}

const cubejsApi = cubejs(
  '${cubejsToken}',
  { apiUrl: '${apiUrl}' }
);

const renderChart = ({ resultSet, error, pivotConfig }) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  ${getChartComponent(chartType)}
};

const ChartRenderer = () => {
  return (
    <QueryRenderer
      query={${query}}
      cubejsApi={cubejsApi}
      resetResultSetOnChange={false}
      render={(props) => renderChart({
        ...props,
        chartType: '${chartType}',
        pivotConfig: ${pivotConfig}
      })}
    />
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<ChartRenderer />, rootElement);
      `,
  };
}

export function getDependencies(chartingLibrary) {
  if (!chartingLibrary) {
    throw new Error('`chartingLibrary` param is undefined');
  }

  const { getImports } = chunksByLibrary[`${chartingLibrary}Charts`];

  return [
    ...commonDependencies,
    ...getImports().map((i) => {
      const [, pkg] = i.match(/['"]([^'"]+)['"]/);
      return pkg;
    }),
  ];
}

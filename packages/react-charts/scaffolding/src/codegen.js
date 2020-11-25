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

export function codegen(
  chartingLibrary,
  { query, pivotConfig, credentials, chartType }
) {
  const { getCommon, getImports, getChartComponent } = chunksByLibrary[
    `${chartingLibrary}Charts`
  ];

  let code = getBaseTemplate();
  code = code.replace('{{imports}}', getImports().join('\n'));
  code = code.replace('{{common}}', getCommon());
  code = code.replace('{{chartComponent}}', getChartComponent(chartType));
  code = code.replace('{{query}}', JSON.stringify(query));
  return code.replace('{{pivotConfig}}', JSON.stringify(pivotConfig));
}

export function dependencies(chartingLibrary) {
  const { getImports } = chunksByLibrary[`${chartingLibrary}Charts`];

  return [
    ...commonDependencies,
    ...getImports().map((i) => {
      const [, pkg] = i.match(/['"]([^'"]+)['"]/);
      return pkg;
    }),
  ];
}

function getBaseTemplate() {
  return `
    import ReactDOM from 'react-dom';
    import cubejs from '@cubejs-client/core';
    import { QueryRenderer } from '@cubejs-client/react';
    import { Spin } from 'antd';
    import 'antd/dist/antd.css';
    {{imports}}

    {{common}}

    const API_URL = 'http://localhost:4000'; // change to your actual endpoint

    const cubejsApi = cubejs(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDU3NzgyNTMsImV4cCI6MTYwNTg2NDY1M30.celH3IHNIT5qmRlBuPhpW267C6s5h_cvaYJPTPiFOUo',
      { apiUrl: API_URL + '/cubejs-api/v1' }
    );

    const renderChart = ({ resultSet, error, pivotConfig }) => {
      if (error) {
        return <div>{error.toString()}</div>;
      }

      if (!resultSet) {
        return <Spin />;
      }

      {{chartComponent}}
    };

    const ChartRenderer = () => {
      return (
        <QueryRenderer
          query={{{query}}}
          cubejsApi={cubejsApi}
          resetResultSetOnChange={false}
          render={(props) => {
            return renderChart({
              ...props,
              pivotConfig: {{pivotConfig}}
            });
          }}
        />
      );
    };

    const rootElement = document.getElementById('root');
    ReactDOM.render(<ChartRenderer />, rootElement);
  `;
}

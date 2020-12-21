import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import { Spin } from 'antd';

const API_URL = undefined;
const CUBEJS_TOKEN = undefined;

const data = window.parent.window['__cubejsPlayground'] || {};

const cubejsApi = cubejs(data.token || CUBEJS_TOKEN, {
  apiUrl: data.apiUrl || API_URL,
});

const ChartRenderer = ({ renderFunction, query, pivotConfig }) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  return renderFunction({ resultSet, pivotConfig });
};

const ChartContainer = ({ renderFunction, query, pivotConfig = null }) => {
  return (
    <CubeProvider cubejsApi={cubejsApi}>
      <ChartRenderer
        renderFunction={renderFunction}
        query={query}
        pivotConfig={pivotConfig}
      />
    </CubeProvider>
  );
};

export default ChartContainer;

import cubejs from '@cubejs-client/core';
import { CubeProvider, useCubeQuery } from '@cubejs-client/react';
import { Spin } from 'antd';

const API_URL = undefined;
const CUBEJS_TOKEN = undefined;

const data = window.parent.window['__cubejs'] || {};

const cubejsApi = cubejs(data.token || CUBEJS_TOKEN, {
  apiUrl: data.apiUrl || API_URL,
});

const ChartRenderer = ({ renderFunction, query, pivotConfig }) => {
  const renderProps = useCubeQuery(query);

  if (!renderProps.resultSet) {
    return <Spin />;
  }

  return renderFunction({ ...renderProps, pivotConfig });
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

import cubejs from '@cubejs-client/core';
import { CubeProvider, useCubeQuery } from '@cubejs-client/react';

const API_URL = undefined;
const CUBEJS_TOKEN = undefined;

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: API_URL,
});

const ChartRenderer = ({ renderFunction, query, pivotConfig }) => {
  const renderProps = useCubeQuery(query);

  if (!renderProps.resultSet) {
    return <div>Loading...</div>;
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

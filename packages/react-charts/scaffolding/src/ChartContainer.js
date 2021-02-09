import { useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import { Spin } from 'antd';

const ChartRenderer = ({ renderFunction, query, pivotConfig }) => {
  const { isLoading, error, resultSet, progress } = useCubeQuery(query);

  useEffect(() => {
    const { onQueryLoad, onQueryProgress } =
      window.parent.window['__cubejsPlayground'] || {};

    if (!isLoading && typeof onQueryLoad === 'function') {
      onQueryLoad({
        resultSet,
        error,
      });
    }

    if (typeof onQueryProgress === 'function') {
      onQueryProgress(progress);
    }
  }, [error, isLoading, resultSet, progress]);

  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  return renderFunction({ resultSet, pivotConfig });
};

const ChartContainer = ({ renderFunction, query, pivotConfig = null }) => (
  <ChartRenderer
    renderFunction={renderFunction}
    query={query}
    pivotConfig={pivotConfig}
  />
);

export default ChartContainer;

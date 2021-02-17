import { useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';

const ChartRenderer = ({ renderFunction, query, pivotConfig }) => {
  const { onQueryLoad, onQueryProgress } =
    window.parent.window['__cubejsPlayground'] || {};

  const { isLoading, error, resultSet, progress } = useCubeQuery(query);

  useEffect(() => {
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

  if (!resultSet || error) {
    return null;
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

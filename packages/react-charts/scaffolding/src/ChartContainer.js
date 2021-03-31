import { useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';

const ChartRenderer = ({
  renderFunction,
  query,
  pivotConfig,
  refetchCounter,
}) => {
  const { onQueryStart, onQueryLoad, onQueryProgress } =
    window.parent.window['__cubejsPlayground'] || {};

  const { isLoading, error, resultSet, progress, refetch } = useCubeQuery(
    query
  );

  useEffect(() => {
    if (isLoading && typeof onQueryStart === 'function') {
      onQueryStart();
    }
  }, [isLoading]);

  useEffect(() => {
    if (refetchCounter > 0) {
      refetch();
    }
  }, [refetchCounter]);

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

const ChartContainer = ({
  renderFunction,
  query,
  pivotConfig = null,
  refetchCounter,
}) => (
  <ChartRenderer
    renderFunction={renderFunction}
    query={query}
    pivotConfig={pivotConfig}
    refetchCounter={refetchCounter}
  />
);

export default ChartContainer;

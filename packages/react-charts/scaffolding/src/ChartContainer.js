import { useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';

const ChartRenderer = ({
  queryId,
  renderFunction,
  query,
  pivotConfig,
  refetchCounter,
}) => {
  const { forQuery } = window.parent.window['__cubejsPlayground'] || {};

  const { onQueryStart, onQueryLoad, onQueryProgress } = forQuery(queryId);

  const { isLoading, error, resultSet, progress, refetch } = useCubeQuery(
    query
  );

  useEffect(() => {
    if (isLoading && typeof onQueryStart === 'function') {
      onQueryStart(queryId);
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
  queryId,
  renderFunction,
  query,
  pivotConfig = null,
  refetchCounter,
}) => (
  <ChartRenderer
    queryId={queryId}
    renderFunction={renderFunction}
    query={query}
    pivotConfig={pivotConfig}
    refetchCounter={refetchCounter}
  />
);

export default ChartContainer;

import { useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import { isQueryPresent } from '@cubejs-client/core';
import { useDeepCompareEffect } from 'use-deep-compare';

const ChartRenderer = ({
  queryId,
  renderFunction,
  query,
  pivotConfig,
  refetchCounter,
}) => {
  const { forQuery } = window.parent.window['__cubejsPlayground'] || {};

  const {
    onQueryStart,
    onQueryLoad,
    onQueryProgress,
    onQueryDrilldown,
  } = forQuery(queryId);

  const { isLoading, error, resultSet, progress, refetch } = useCubeQuery(
    query
  );

  const handleQueryDrilldownRequest = ({ xValues, yValues }, pivotConfig) => {
    if (typeof onQueryDrilldown === 'function') {
      onQueryDrilldown(
        resultSet.drillDown({
          xValues,
          yValues,
        }),
        pivotConfig
      );
    }
  };

  useDeepCompareEffect(() => {
    if (
      isLoading &&
      isQueryPresent(query) &&
      typeof onQueryStart === 'function'
    ) {
      onQueryStart(queryId);
    }
  }, [isLoading, query]);

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

  return renderFunction({
    resultSet,
    pivotConfig,
    onDrilldownRequested: handleQueryDrilldownRequest,
  });
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

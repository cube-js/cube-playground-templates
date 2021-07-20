import React from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import CircularProgress from '@material-ui/core/CircularProgress';

const TypeToChartComponent = {};

const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map((key) => ({ [key]: React.memo(TypeToChartComponent[key]) }))
  .reduce((a, b) => ({ ...a, ...b }));

const renderChart = (Component) => ({ resultSet, error, ...props }) =>
  (resultSet && <Component resultSet={resultSet} {...props} />) ||
  (error && error.toString()) || <CircularProgress />;

const ChartRenderer = ({ vizState = {} }) => {
  const { query, chartType, ...options } = vizState;
  const component = TypeToMemoChartComponent[chartType];
  const renderProps = useCubeQuery(query);

  return component && renderChart(component)({ ...options, ...renderProps });
};

export default ChartRenderer;

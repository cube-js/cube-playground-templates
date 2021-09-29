import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useDeepCompareMemo } from 'use-deep-compare';

const COLORS_SERIES = [
  '#5b8ff9',
  '#5ad8a6',
  '#5e7092',
  '#f6bd18',
  '#6f5efa',
  '#6ec8ec',
  '#945fb9',
  '#ff9845',
  '#299796',
  '#fe99c3',
];

const PALE_COLORS_SERIES = [
  '#d7e3fd',
  '#daf5e9',
  '#d6dbe4',
  '#fdeecd',
  '#dad8fe',
  '#dbf1fa',
  '#e4d7ed',
  '#ffe5d2',
  '#cce5e4',
  '#ffe6f0',
];

const commonOptions = {
  maintainAspectRatio: true,
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 0,
        padding: 12,
        minRotation: 0,
      },
    },
  },
};

const useDrilldownCallback = ({
  datasets,
  labels,
  onDrilldownRequested,
  pivotConfig,
}) => {
  return React.useCallback(
    (elements) => {
      if (elements.length <= 0) return;
      const { datasetIndex, index } = elements[0];
      const { yValues } = datasets[datasetIndex];
      const xValues = [labels[index]];
      if (typeof onDrilldownRequested === 'function') {
        onDrilldownRequested({ xValues, yValues }, pivotConfig);
      }
    },
    [datasets, labels, onDrilldownRequested]
  );
};

const LineChartRenderer = ({ resultSet, onDrilldownRequested }) => {
  const datasets = useDeepCompareMemo(
    () =>
      resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        yValues: [s.key],
        borderColor: COLORS_SERIES[index],
        pointRadius: 1,
        tension: 0.1,
        pointHoverRadius: 1,
        borderWidth: 2,
        tickWidth: 1,
        fill: false,
      })),
    [resultSet]
  );

  const data = {
    labels: resultSet.categories().map((c) => c.x),
    datasets,
  };

  const getElementAtEvent = useDrilldownCallback({
    datasets: data.datasets,
    labels: data.labels,
    onDrilldownRequested,
  });

  return (
    <Line
      type="line"
      data={data}
      options={commonOptions}
      getElementAtEvent={getElementAtEvent}
    />
  );
};

const BarChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested }) => {
  const datasets = useDeepCompareMemo(
    () =>
      resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        yValues: [s.key],
        backgroundColor: COLORS_SERIES[index],
        fill: false,
      })),
    [resultSet]
  );

  const data = {
    labels: resultSet.categories().map((c) => c.x),
    datasets,
  };

  const stacked = !(pivotConfig.x || []).includes('measures');

  const options = {
    ...commonOptions,
    scales: {
      x: {
        ...commonOptions.scales.x,
        stacked,
      },
      y: {
        ...commonOptions.scales.y,
        stacked,
      },
    },
  };

  const getElementAtEvent = useDrilldownCallback({
    datasets: data.datasets,
    labels: data.labels,
    onDrilldownRequested,
    pivotConfig,
  });

  return (
    <Bar
      type="bar"
      data={data}
      options={options}
      getElementAtEvent={getElementAtEvent}
    />
  );
};

const AreaChartRenderer = ({ resultSet, onDrilldownRequested }) => {
  const datasets = useDeepCompareMemo(
    () =>
      resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        yValues: [s.key],
        pointRadius: 1,
        pointHoverRadius: 1,
        backgroundColor: PALE_COLORS_SERIES[index],
        borderWidth: 0,
        fill: true,
        tension: 0,
      })),
    [resultSet]
  );

  const data = {
    labels: resultSet.categories().map((c) => c.x),
    datasets,
  };

  const options = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        stacked: true,
      },
    },
  };

  const getElementAtEvent = useDrilldownCallback({
    datasets: data.datasets,
    labels: data.labels,
    onDrilldownRequested,
  });

  return (
    <Line
      type="area"
      data={data}
      options={options}
      getElementAtEvent={getElementAtEvent}
    />
  );
};

const PieChartRenderer = ({ resultSet, onDrilldownRequested }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.x),
    datasets: resultSet.series().map((s) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      yValues: [s.key],
      backgroundColor: COLORS_SERIES,
      hoverBackgroundColor: COLORS_SERIES,
    })),
  };

  const getElementAtEvent = useDrilldownCallback({
    datasets: data.datasets,
    labels: data.labels,
    onDrilldownRequested,
  });

  return (
    <Pie
      type="pie"
      data={data}
      options={commonOptions}
      getElementAtEvent={getElementAtEvent}
    />
  );
};

const TypeToChartComponent = {
  line: ({ resultSet, onDrilldownRequested }) => {
    return (
      <LineChartRenderer
        resultSet={resultSet}
        onDrilldownRequested={onDrilldownRequested}
      />
    );
  },
  bar: ({ resultSet, pivotConfig, onDrilldownRequested }) => {
    return (
      <BarChartRenderer
        resultSet={resultSet}
        pivotConfig={pivotConfig}
        onDrilldownRequested={onDrilldownRequested}
      />
    );
  },
  area: ({ resultSet, onDrilldownRequested }) => {
    return (
      <AreaChartRenderer
        resultSet={resultSet}
        onDrilldownRequested={onDrilldownRequested}
      />
    );
  },
  pie: ({ resultSet, onDrilldownRequested }) => {
    return (
      <PieChartRenderer
        resultSet={resultSet}
        onDrilldownRequested={onDrilldownRequested}
      />
    );
  },
};
export default TypeToChartComponent;

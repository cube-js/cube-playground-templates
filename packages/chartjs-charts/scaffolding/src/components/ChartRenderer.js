import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

import { useDeepMemo } from '../../../hooks';

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
  maintainAspectRatio: false,
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

const LineChartRenderer = ({ resultSet }) => {
  const datasets = useDeepMemo(
    () =>
      resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
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
    labels: resultSet.categories().map((c) => c.category),
    datasets,
  };

  return <Line type="line" data={data} options={commonOptions} />;
};

const BarChartRenderer = ({ resultSet, pivotConfig }) => {
  const datasets = useDeepMemo(
    () =>
      resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        backgroundColor: COLORS_SERIES[index],
        fill: false,
      })),
    [resultSet]
  );

  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets,
  };
  const options = {
    ...commonOptions,
    scales: {
      x: {
        ...commonOptions.scales.x,
        stacked: !(pivotConfig.x || []).includes('measures'),
      },
    },
  };
  return <Bar type="bar" data={data} options={options} />;
};

const AreaChartRenderer = ({ resultSet }) => {
  const datasets = useDeepMemo(
    () =>
      resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
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
    labels: resultSet.categories().map((c) => c.category),
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

  return <Line type="area" data={data} options={options} />;
};

const TypeToChartComponent = {
  line: (props) => {
    return <LineChartRenderer {...props} />;
  },
  bar: (props) => {
    return <BarChartRenderer {...props} />;
  },
  area: (props) => {
    return <AreaChartRenderer {...props} />;
  },
  pie: ({ resultSet }) => {
    const data = {
      labels: resultSet.categories().map((c) => c.category),
      datasets: resultSet.series().map((s) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        backgroundColor: COLORS_SERIES,
        hoverBackgroundColor: COLORS_SERIES,
      })),
    };

    return <Pie type="pie" data={data} options={commonOptions} />;
  },
};
export default TypeToChartComponent;

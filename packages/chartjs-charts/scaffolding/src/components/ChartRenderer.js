import { Line, Bar, Pie } from 'react-chartjs-2';

const COLORS_SERIES = ['#FF6492', '#141446', '#7A77FF'];

const commonOptions = {
  maintainAspectRatio: false,
};

const TypeToChartComponent = {
  line: ({ resultSet }) => {
    const data = {
      labels: resultSet.categories().map((c) => c.category),
      datasets: resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        borderColor: COLORS_SERIES[index],
        fill: false,
      })),
    };
    const options = {
      ...commonOptions,
    };
    return <Line data={data} options={options} />;
  },
  bar: ({ resultSet }) => {
    const data = {
      labels: resultSet.categories().map((c) => c.category),
      datasets: resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        backgroundColor: COLORS_SERIES[index],
        fill: false,
      })),
    };
    const options = {
      ...commonOptions,
      scales: {
        xAxes: [{ stacked: true }],
      },
    };
    return <Bar data={data} options={options} />;
  },
  area: ({ resultSet }) => {
    const data = {
      labels: resultSet.categories().map((c) => c.category),
      datasets: resultSet.series().map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        backgroundColor: COLORS_SERIES[index],
      })),
    };
    const options = {
      ...commonOptions,
      scales: {
        yAxes: [{ stacked: true }],
      },
    };
    return <Line data={data} options={options} />;
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
    const options = {
      ...commonOptions,
    };
    return <Pie data={data} options={options} />;
  },
};

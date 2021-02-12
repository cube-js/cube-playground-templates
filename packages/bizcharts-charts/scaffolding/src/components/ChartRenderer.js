import { Chart, Axis, Tooltip, Geom, PieChart } from 'bizcharts';

const stackedChartData = (resultSet) => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(xValues, ', '),
        color: resultSet.axisValuesString(yValues, ', '),
        measure: m && Number.parseFloat(m),
      }))
    )
    .reduce((a, b) => a.concat(b), []);

  return data;
};

const TypeToChartComponent = {
  line: ({ resultSet }) => {
    return (
      <Chart
        scale={{ x: { tickCount: 8 } }}
        autoFit
        height={400}
        data={stackedChartData(resultSet)}
        forceFit
      >
        <Axis name="x" />
        <Axis name="measure" />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="line" position="x*measure" size={2} color="color" />
      </Chart>
    );
  },
  bar: ({ resultSet }) => {
    return (
      <Chart
        scale={{ x: { tickCount: 8 } }}
        autoFit
        height={400}
        data={stackedChartData(resultSet)}
        forceFit
      >
        <Axis name="x" />
        <Axis name="measure" />
        <Tooltip />
        <Geom type="interval" position="x*measure" color="color" />
      </Chart>
    );
  },
  area: ({ resultSet }) => {
    return (
      <Chart
        scale={{ x: { tickCount: 8 } }}
        autoFit
        height={400}
        data={stackedChartData(resultSet)}
        forceFit
      >
        <Axis name="x" />
        <Axis name="measure" />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="area" position="x*measure" size={2} color="color" />
      </Chart>
    );
  },
  pie: ({ resultSet }) => {
    return (
      <PieChart
        data={resultSet.chartPivot()}
        radius={0.8}
        angleField={resultSet.series()[0].key}
        colorField="x"
        label={{
          visible: true,
          offset: 20,
        }}
        legend={{
          position: 'bottom',
        }}
      />
    );
  },
};

import React from 'react';
import { Chart, Axis, Tooltip, Geom, PieChart } from 'bizcharts';
import { useDeepCompareMemo } from 'use-deep-compare';

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

const LineChartRenderer = ({ resultSet }) => {
  const data = useDeepCompareMemo(() => stackedChartData(resultSet), [
    resultSet,
  ]);

  return (
    <Chart
      scale={{
        x: {
          tickCount: 8,
        },
      }}
      autoFit
      height={400}
      data={data}
      forceFit
    >
      <Axis name="x" />
      <Axis name="measure" />
      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />
      <Geom type="line" position="x*measure" size={2} color="color" />
    </Chart>
  );
};

const BarChartRenderer = ({ resultSet, pivotConfig }) => {
  const data = useDeepCompareMemo(() => stackedChartData(resultSet), [
    resultSet.serialize(),
  ]);

  const stacked = !(pivotConfig.x || []).includes('measures');

  return (
    <Chart
      scale={{
        x: {
          tickCount: 8,
        },
      }}
      autoFit
      height={400}
      data={data}
      forceFit
    >
      <Axis name="x" />
      <Axis name="measure" />
      <Tooltip />
      <Geom
        type="interval"
        position="x*measure"
        color="color"
        adjust={stacked ? 'stack' : 'dodge'}
      />
    </Chart>
  );
};

const AreaChartRenderer = ({ resultSet }) => {
  const data = useDeepCompareMemo(() => stackedChartData(resultSet), [
    resultSet.serialize(),
  ]);

  return (
    <Chart
      scale={{
        x: {
          tickCount: 8,
        },
      }}
      autoFit
      height={400}
      data={data}
      forceFit
    >
      <Axis name="x" />
      <Axis name="measure" />
      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />
      <Geom
        type="area"
        adjust="stack"
        position="x*measure"
        size={2}
        color="color"
      />
    </Chart>
  );
};

const PieChartRenderer = ({ resultSet }) => {
  const [data, angleField] = useDeepCompareMemo(() => {
    return [resultSet.chartPivot(), resultSet.series()];
  }, [resultSet]);

  return (
    <PieChart
      data={data}
      radius={0.8}
      angleField={angleField[0].key}
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
};

const TypeToChartComponent = {
  line: ({ resultSet }) => {
    return <LineChartRenderer resultSet={resultSet} />;
  },
  bar: ({ resultSet, pivotConfig }) => {
    return <BarChartRenderer resultSet={resultSet} pivotConfig={pivotConfig} />;
  },
  area: ({ resultSet }) => {
    return <AreaChartRenderer resultSet={resultSet} />;
  },
  pie: ({ resultSet }) => {
    return <PieChartRenderer resultSet={resultSet} />;
  },
};

export default TypeToChartComponent;

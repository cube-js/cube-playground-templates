import React from 'react';
import { Chart, Axis, Tooltip, Geom, PieChart } from 'bizcharts';
import { Row, Col, Statistic, Table } from 'antd';

import { useDeepMemo } from '../../../hooks';

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
  const data = useDeepMemo(() => stackedChartData(resultSet), [resultSet]);

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

const BarChartRenderer = ({ resultSet }) => {
  const data = useDeepMemo(() => stackedChartData(resultSet), [
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
      <Tooltip />
      <Geom type="interval" position="x*measure" color="color" />
    </Chart>
  );
};

const AreaChartRenderer = ({ resultSet }) => {
  const data = useDeepMemo(() => stackedChartData(resultSet), [
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
  const [data, angleField] = useDeepMemo(() => {
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

const TableRenderer = ({ resultSet, pivotConfig }) => {
  const [tableColumns, dataSource] = useDeepMemo(() => {
    return [
      resultSet.tableColumns(pivotConfig),
      resultSet.tablePivot(pivotConfig),
    ];
  }, [resultSet, pivotConfig]);

  return (
    <Table pagination={false} columns={tableColumns} dataSource={dataSource} />
  );
};

const TypeToChartComponent = {
  line: ({ resultSet }) => {
    return <LineChartRenderer resultSet={resultSet} />;
  },
  bar: ({ resultSet }) => {
    return <BarChartRenderer resultSet={resultSet} />;
  },
  area: ({ resultSet }) => {
    return <AreaChartRenderer resultSet={resultSet} />;
  },
  pie: ({ resultSet }) => {
    return <PieChartRenderer resultSet={resultSet} />;
  },
  number: ({ resultSet }) => {
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{
          height: '100%',
        }}
      >
        <Col>
          {resultSet.seriesNames().map((s) => (
            <Statistic value={resultSet.totalRow()[s.key]} />
          ))}
        </Col>
      </Row>
    );
  },
  table: ({ resultSet, pivotConfig }) => {
    return <TableRenderer resultSet={resultSet} pivotConfig={pivotConfig} />;
  },
};

export default TypeToChartComponent;

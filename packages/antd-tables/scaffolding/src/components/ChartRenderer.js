import { Row, Col, Statistic, Table } from 'antd';
import { useDeepCompareMemo } from 'use-deep-compare';

const formatTableData = (columns, data) => {
  function flatten(columns = []) {
    return columns.reduce((memo, column) => {
      if (column.children) {
        return [...memo, ...flatten(column.children)];
      }

      return [...memo, column];
    }, []);
  }

  const typeByIndex = flatten(columns).reduce((memo, column) => {
    return {
      ...memo,
      [column.dataIndex]: column,
    };
  }, {});

  function formatValue(value, { type, format } = {}) {
    if (value == undefined) {
      return value;
    }

    if (type === 'boolean') {
      return Boolean(value).toString();
    }

    if (type === 'number' && format === 'percent') {
      return [parseFloat(value).toFixed(2), '%'].join('');
    }

    return value.toString();
  }

  function format(row) {
    return Object.fromEntries(
      Object.entries(row).map(([dataIndex, value]) => {
        return [dataIndex, formatValue(value, typeByIndex[dataIndex])];
      })
    );
  }

  return data.map(format);
};

const TableRenderer = ({ resultSet, pivotConfig }) => {
  const [tableColumns, dataSource] = useDeepCompareMemo(() => {
    const columns = resultSet.tableColumns(pivotConfig);

    return [
      columns,
      formatTableData(columns, resultSet.tablePivot(pivotConfig)),
    ];
  }, [resultSet, pivotConfig]);

  return (
    <Table pagination={false} columns={tableColumns} dataSource={dataSource} />
  );
};

const TypeToChartComponent = {
  number: ({ resultSet }) => {
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ height: '100%' }}
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

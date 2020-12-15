import { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import '@ant-design/compatible';
import { getCodesandboxFiles, getDependencies } from './codegen';
import ChartContainer from './ChartContainer';

const libs = {};

const App = () => {
  const [query, setQuery] = useState(null);
  const [pivotConfig, setPivotConfig] = useState(null);
  const [library, setLibrary] = useState(null);
  const [chartType, setChartType] = useState(null);

  useEffect(() => {
    window['__cubejs'] = {
      getCodesandboxFiles,
      getDependencies,
    };

    window.dispatchEvent(new CustomEvent('cubejsChartReady'));

    window.addEventListener('cubejs', (event) => {
      const { query, chartingLibrary, chartType, pivotConfig } = event.detail;

      if (query) {
        setQuery(query);
      }
      if (pivotConfig) {
        setPivotConfig(pivotConfig);
      }
      if (chartingLibrary) {
        setLibrary(chartingLibrary);
      }
      if (chartType) {
        if (chartingLibrary === 'bizcharts') {
          // avoid the bug where bizchars would throw an error on chart type change
          setChartType(null);
          setTimeout(() => setChartType(chartType), 0);
        } else {
          setChartType(chartType);
        }
      }
    });
  }, []);

  return (
    <div className="App">
      {libs[library]?.[chartType] ? (
        <ChartContainer
          renderFunction={libs[library][chartType]}
          query={query}
          pivotConfig={pivotConfig}
        />
      ) : null}
    </div>
  );
};

export default App;

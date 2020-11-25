import { useState, useEffect } from 'react';
import { codegen, dependencies } from './codegen';
import ChartContainer from './ChartContainer';

const libs = {};

const App = () => {
  const [query, setQuery] = useState(null);
  const [pivotConfig, setPivotConfig] = useState(null);
  const [library, setLibrary] = useState(null);
  const [chartType, setChartType] = useState(null);

  useEffect(() => {
    window.__cubejs = {
      codegen,
      dependencies,
    };

    const event = new CustomEvent('cubejsChartReady');
    event.initEvent('cubejsChartReady', true);
    document.body.dispatchEvent(event);

    document.body.addEventListener('cubejs', (event) => {
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
        setChartType(chartType);
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

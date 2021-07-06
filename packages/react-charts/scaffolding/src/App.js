import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import 'antd/dist/antd.css';
import '@ant-design/compatible';
import './style.css';
import { getCodesandboxFiles, getDependencies } from './codegen';
import ChartContainer from './ChartContainer';

window['__cubejsPlayground'] = {
  getCodesandboxFiles,
  getDependencies,
};

const libs = {};

const App = () => {
  const [_, queryId] = window.location.hash.replace(/#\\/, '').split('=');

  const [query, setQuery] = useState(null);
  const [pivotConfig, setPivotConfig] = useState(null);
  const [library, setLibrary] = useState(null);
  const [chartType, setChartType] = useState(null);
  const [credetialsVersion, updateVersion] = useState(0);
  const [refetchCounter, updateRefetchCounter] = useState(0);

  const cubejsApi = useMemo(() => {
    const data = window.parent.window['__cubejsPlayground'] || {};

    return cubejs(data.token, {
      apiUrl: data.apiUrl,
    });
  }, [credetialsVersion]);

  useEffect(() => {
    const { forQuery } = window.parent.window['__cubejsPlayground'] || {};

    if (typeof forQuery === 'function') {
      forQuery(queryId).onChartRendererReady();
    }
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('__cubejsPlaygroundEvent', (event) => {
      const {
        query,
        chartingLibrary,
        chartType,
        pivotConfig,
        eventType,
      } = event.detail;

      if (eventType === 'chart') {
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
      } else if (eventType === 'credentials') {
        updateVersion((prev) => prev + 1);
      } else if (eventType === 'refetch') {
        updateRefetchCounter((prev) => prev + 1);
      }
    });
  }, []);

  return (
    <CubeProvider cubejsApi={cubejsApi}>
      <div className="App">
        {libs[library]?.[chartType] ? (
          <ChartContainer
            queryId={queryId}
            renderFunction={libs[library][chartType]}
            query={query}
            pivotConfig={pivotConfig}
            refetchCounter={refetchCounter}
          />
        ) : null}
      </div>
    </CubeProvider>
  );
};

export default App;

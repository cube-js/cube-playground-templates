<template>
  <div class="container" v-if="cubejsApi && chartingLibrary">
    <query-renderer
      :cubejsApi="cubejsApi"
      :query="query"
      :chartType="chartType"
      @queryStatus="handleQueryStatusChange"
    >
      <template #default="{ resultSet }">
        <chart-renderer
          v-if="resultSet"
          :component="chartingLibrary"
          :chart-type="chartType"
          :result-set="resultSet"
        ></chart-renderer>
      </template>
    </query-renderer>
  </div>
</template>

<script>
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/vue';

import { getCodesandboxFiles, getDependencies } from './code-chunks';
import ChartRenderer from './ChartRenderer';

window['__cubejsPlayground'] = {
  getCodesandboxFiles,
  getDependencies,
};

const API_URL = 'http://localhost:4000/cubejs-api/v1';
const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTQ2NjY4OTR9.0fdi5cuDZ2t3OSrPOMoc3B1_pwhnWj4ZmM3FHEX7Aus';

export default {
  name: 'ChartContainer',

  data() {
    return {
      chartingLibrary: null,
      query: {},
      pivotConfig: null,
      chartType: 'line',
      apiUrl: API_URL,
      token: CUBEJS_TOKEN,
      cubejsApi: null,
    };
  },

  mounted() {
    this.token = 'test.token';
    this.query = {
      measures: ['Sales.count'],
    };
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
          this.query = query;
        }
        if (pivotConfig) {
          this.pivotConfig = pivotConfig;
        }
        if (chartingLibrary) {
          this.chartingLibrary = chartingLibrary;
        }
        if (chartType) {
          this.chartType = chartType;
        }
      } else if (eventType === 'credentials') {
        // updateVersion((prev) => prev + 1);
      }
    });

    const { onChartRendererReady } =
      window.parent.window['__cubejsPlayground'] || {};
    if (typeof onChartRendererReady === 'function') {
      onChartRendererReady();
    }
  },

  methods: {
    handleQueryStatusChange({ isLoading, resultSet, error }) {
      const { onQueryStart, onQueryLoad } =
        window.parent.window['__cubejsPlayground'] || {};

      if (isLoading && typeof onQueryStart === 'function') {
        onQueryStart();
      }
      if (!isLoading && typeof onQueryLoad === 'function') {
        onQueryLoad({ resultSet, error });
      }
    },
  },

  computed: {
    credentials() {
      return [this.apiUrl, this.token].join();
    },
  },

  watch: {
    credentials(value) {
      this.cubejsApi = cubejs(this.token, {
        apiUrl: this.apiUrl,
      });
    },
  },

  components: {
    QueryRenderer,
    ChartRenderer,
  },
};
</script>

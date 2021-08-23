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

export default {
  name: 'ChartContainer',

  data() {
    return {
      queryId: null,
      chartingLibrary: null,
      query: {},
      pivotConfig: null,
      chartType: 'line',
      apiUrl: null,
      token: null,
      cubejsApi: null,
    };
  },

  mounted() {
    this.queryId = window.location.hash.replace(/#\\/, '').split('=')[1];

    const { forQuery, ...data } =
      window.parent.window['__cubejsPlayground'] || {};

    this.apiUrl = data.apiUrl;
    this.token = data.token;

    const { onChartRendererReady } = forQuery(this.queryId);
    if (typeof onChartRendererReady === 'function') {
      onChartRendererReady();
    }

    window.addEventListener('__cubejsPlaygroundEvent', (event) => {
      const {
        apiUrl,
        token,
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
        this.apiUrl = apiUrl;
        this.token = token;
      }
    });
  },

  methods: {
    handleQueryStatusChange({ isLoading, resultSet, error }) {
      const { forQuery } = window.parent.window['__cubejsPlayground'] || {};
      const { onQueryStart, onQueryLoad } = forQuery(this.queryId);

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
    credentials() {
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

<template>
  <component
    v-bind:is="component"
    :resultSet="resultSet"
    :chartType="chartType"
  />
</template>
<script>
import { ResultSet } from '@cubejs-client/core';

export default {
  name: 'ChartRenderer',
  props: {
    component: {
      type: String,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
      default: () => 'line',
    },
    resultSet: {
      type: ResultSet,
      required: true,
    },
  },
  components: {},
};
</script>

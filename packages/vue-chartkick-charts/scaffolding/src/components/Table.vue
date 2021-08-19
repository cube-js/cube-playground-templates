<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="10000"
    :hide-default-footer="true"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  name: 'Table',
  props: ['resultSet'],
  mounted() {},
  data: () => ({}),
  computed: {
    headers() {
      const columns = this.resultSet.tableColumns();

      return columns.map(({ key, title }) => {
        return {
          text: title,
          align: 'start',
          sortable: false,
          value: key,
        };
      });
    },
    items() {
      const data = this.resultSet.tablePivot();
      return data.map((key) => {
        return key;
      });
    },
  },
};
</script>
<style>
html {
  font-family: Roboto, sans-serif;
}
</style>

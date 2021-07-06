import { Component, Input } from '@angular/core';
import { isQueryPresent, ResultSet } from '@cubejs-client/core';
import { CubejsClient, TChartType } from '@cubejs-client/ngx';
import { BehaviorSubject, combineLatest, of, merge } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { getDisplayedColumns, flattenColumns } from './utils';

@Component({
  selector: 'query-renderer',
  templateUrl: './query-renderer.component.html',
  styles: [
    `
      .chart-container {
        position: relative;
        height: calc(100% - 52px);
        min-height: 400px;
      }

      .numeric-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
      }

      :host {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    `,
  ],
})
export class QueryRendererComponent {
  @Input('cubeQuery')
  cubeQuery$: BehaviorSubject<any>;

  @Input('pivotConfig')
  pivotConfig$: any;

  @Input('chartType')
  chartType$: any;

  chartType: any = null;
  isQueryPresent = false;
  error: string | null = null;

  displayedColumns: string[] = [];
  tableData: any[] = [];
  columnTitles: string[] = [];
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  noFillChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        fill: false,
      },
    },
  };
  numericValues: number[] = [];
  loading = false;

  constructor(private cubejsClient: CubejsClient) {}

  ngOnInit() {
    let onQueryStart;
    let onQueryLoad;

    try {
      const queryId = window.location.hash.replace(/#\\/, '').split('=')[1];
      const { forQuery } = window.parent.window['__cubejsPlayground'] || {};
      onQueryStart = forQuery(queryId).onQueryStart;
      onQueryLoad = forQuery(queryId).onQueryLoad;
    } catch (_) {}

    combineLatest([
      this.cubeQuery$.pipe(
        switchMap((cubeQuery) => {
          return of(isQueryPresent(cubeQuery || {}));
        })
      ),
      this.cubeQuery$.pipe(
        switchMap((cubeQuery) => {
          this.error = null;
          if (!isQueryPresent(cubeQuery || {})) {
            return of(null);
          }
          this.loading = true;

          if (typeof onQueryStart === 'function') {
            onQueryStart();
          }

          return merge(
            of(null),
            this.cubejsClient.load(cubeQuery).pipe(
              catchError((error) => {
                this.error = error.toString();
                console.error(error);
                return of(null);
              })
            )
          );
        })
      ),
      this.pivotConfig$,
      this.chartType$,
    ]).subscribe(
      ([isQueryPresent, resultSet, pivotConfig, chartType]: [
        boolean,
        ResultSet,
        any,
        TChartType
      ]) => {
        this.chartType = chartType;
        this.isQueryPresent = isQueryPresent;

        if (resultSet != null) {
          this.loading = false;
        }

        if (typeof onQueryLoad === 'function') {
          onQueryLoad({
            resultSet,
            error: this.error,
          });
        }

        if (resultSet) {
          if (this.chartType === 'table') {
            this.updateTableData(resultSet, pivotConfig);
          } else if (this.chartType === 'number') {
            this.updateNumericData(resultSet);
          } else {
            this.updateChartData(resultSet, pivotConfig);
          }
        }
      }
    );
  }

  updateChartData(resultSet, pivotConfig) {
    this.chartData = resultSet.series(pivotConfig).map((item) => {
      return {
        label: item.title,
        data: item.series.map(({ value }) => value),
        stack: 'a',
      };
    });
    this.chartLabels = resultSet.chartPivot(pivotConfig).map((row) => row.x);
  }

  updateTableData(resultSet, pivotConfig) {
    this.tableData = resultSet.tablePivot(pivotConfig);
    this.displayedColumns = getDisplayedColumns(
      resultSet.tableColumns(pivotConfig)
    );
    this.columnTitles = flattenColumns(resultSet.tableColumns(pivotConfig));
  }

  updateNumericData(resultSet) {
    this.numericValues = resultSet
      .seriesNames()
      .map((s) => resultSet.totalRow()[s.key]);
  }
}

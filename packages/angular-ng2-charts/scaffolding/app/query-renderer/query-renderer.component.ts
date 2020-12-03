import { Component, Input } from '@angular/core';
import { isQueryPresent, ResultSet } from '@cubejs-client/core';
import { CubejsClient, TChartType } from '@cubejs-client/ngx';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
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

  constructor(private cubejsClient: CubejsClient) {}

  ngOnInit() {
    combineLatest([
      this.cubeQuery$.pipe(
        switchMap((cubeQuery) => {
          if (!isQueryPresent(cubeQuery || {})) {
            return of(null);
          }
          return this.cubejsClient.load(cubeQuery).pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          );
        })
      ),
      this.pivotConfig$,
      this.chartType$,
    ]).subscribe(
      ([resultSet, pivotConfig, chartType]: [ResultSet, any, TChartType]) => {
        this.chartType = chartType;
        this.isQueryPresent = resultSet != null;

        if (this.chartType === 'table') {
          this.updateTableData(resultSet, pivotConfig);
        } else {
          this.updateChartData(resultSet, pivotConfig);
        }
      }
    );
  }

  updateChartData(resultSet, pivotConfig) {
    if (!resultSet) {
      return;
    }

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
    if (!resultSet) {
      return;
    }

    this.tableData = resultSet.tablePivot(pivotConfig);
    this.displayedColumns = getDisplayedColumns(
      resultSet.tableColumns(pivotConfig)
    );
    this.columnTitles = flattenColumns(resultSet.tableColumns(pivotConfig));
  }
}

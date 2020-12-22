import { Component, Input } from '@angular/core';
import { isQueryPresent, ResultSet } from '@cubejs-client/core';
import { CubejsClient, TChartType } from '@cubejs-client/ngx';
import { BehaviorSubject, combineLatest, of, merge } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { getDisplayedColumns, flattenColumns } from './utils';
import { NgxSpinnerService } from 'ngx-spinner';

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
  loading = false;

  constructor(
    private cubejsClient: CubejsClient,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
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
          this.spinner.show();

          return merge(
            of(null),
            this.cubejsClient.load(cubeQuery).pipe(
              catchError((error) => {
                this.spinner.hide();
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
          this.spinner.hide();
          this.loading = false;

          const { onQueryLoad } =
            window.parent.window['__cubejsPlayground'] || {};
          if (typeof onQueryLoad === 'function') {
            onQueryLoad(resultSet);
          }
        }

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

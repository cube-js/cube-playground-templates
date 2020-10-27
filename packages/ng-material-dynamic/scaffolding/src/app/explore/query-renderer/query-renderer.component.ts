import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  isQueryPresent,
  PivotConfig as TPivotConfig,
  Query,
  ResultSet,
} from '@cubejs-client/core';
import { CubejsClient, TChartType } from '@cubejs-client/ngx';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'query-renderer',
  templateUrl: './query-renderer.component.html',
  styleUrls: ['./query-renderer.component.css'],
})
export class QueryRendererComponent implements OnInit {
  data: any = {};
  isQueryPresent: boolean;

  @Input()
  resetResultSetOnChange: boolean = false;

  @Input('cubeQuery')
  cubeQuery$: Observable<Query>;

  @Input('pivotConfig')
  pivotConfig$: Observable<TPivotConfig>;

  @Input('chartType')
  chartType$: Observable<TChartType>;

  chartType: TChartType;

  constructor(
    private cubejsClient: CubejsClient,
    private snakBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    combineLatest([
      this.cubeQuery$.pipe(
        switchMap((cubeQuery) => {
          if (!isQueryPresent(cubeQuery || {})) {
            return of(null);
          }
          this.data.cubeQuery = cubeQuery;
          return this.cubejsClient.load(cubeQuery).pipe(
            catchError((error) => {
              this.snakBar.open(error.message || 'Request error', null, {
                duration: 2000,
              });
              return of(null);
            })
          );
        })
      ),
      this.pivotConfig$,
      this.chartType$,
    ]).subscribe(
      ([resultSet, pivotConfig, chartType]: [
        ResultSet,
        TPivotConfig,
        TChartType
      ]) => {
        this.chartType = chartType;
        this.data.chartType = chartType;
        this.data.pivotConfig = pivotConfig;
        this.isQueryPresent = resultSet != null;
        this.updateChart(resultSet, pivotConfig);
      }
    );
  }
}

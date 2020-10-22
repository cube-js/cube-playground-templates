import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  isQueryPresent,
  PivotConfig as TPivotConfig,
  ResultSet,
} from '@cubejs-client/core';
import {
  CubejsClient,
  QueryBuilderService,
  TChartType,
} from '@cubejs-client/ngx';
import { combineLatest, of } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'query-renderer',
  templateUrl: './query-renderer.component.html',
  styleUrls: ['./query-renderer.component.css'],
})
class QueryRendererComponent implements OnInit {
  resultSet: ResultSet;
  chartType: TChartType = 'line';
  isQueryPresent: boolean;

  @Input()
  resetResultSetOnChange: boolean = false;

  @Input()
  queryBuilder: QueryBuilderService;

  constructor(
    private cubejsClient: CubejsClient,
    private snakBar: MatSnackBar
  ) {}

  async ngOnInit() {
    const query = await this.queryBuilder.query;

    combineLatest([
      query.subject.pipe(
        switchMap((cubeQuery) => {
          if (!isQueryPresent(cubeQuery)) {
            return of(null);
          }
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
      this.queryBuilder.pivotConfig.subject,
      this.queryBuilder.chartType.subject,
    ])
      .pipe(debounceTime(300))
      .subscribe(
        ([resultSet, pivotConfig, chartType]: [
          ResultSet,
          TPivotConfig,
          TChartType
        ]) => {
          this.chartType = chartType;
          if (resultSet != null || this.resetResultSetOnChange) {
            this.resultSet = resultSet;
          }
          this.isQueryPresent = resultSet != null;
          this.updateChart(resultSet, pivotConfig);
        }
      );
  }
}

export { QueryRendererComponent };

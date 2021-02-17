import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  PivotConfig as TPivotConfig,
  Query,
  ResultSet,
} from '@cubejs-client/core';
import { CubejsClient, TChartType } from '@cubejs-client/ngx';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Observable } from 'rxjs';

import { AddToDashboardDialogComponent } from '../add-to-dashboard-dialog/add-to-dashboard-dialog.component';
import { flattenColumns, getDisplayedColumns } from './utils';

@Component({
  selector: 'query-renderer',
  templateUrl: './query-renderer.component.html',
  styleUrls: ['./query-renderer.component.css'],
})
export class QueryRendererComponent implements OnInit {
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

  updateChart(resultSet: ResultSet | null, pivotConfig: TPivotConfig) {
    if (!resultSet) {
      return;
    }

    if (this.chartType === 'table') {
      this.tableData = resultSet.tablePivot(pivotConfig);
      this.displayedColumns = getDisplayedColumns(
        resultSet.tableColumns(pivotConfig)
      );
      this.columnTitles = flattenColumns(resultSet.tableColumns(pivotConfig));
    } else {
      this.chartData = resultSet.series(pivotConfig).map((item) => {
        return {
          label: item.title,
          data: item.series.map(({ value }) => value),
          stack: 'a',
        };
      });
      this.chartLabels = resultSet.chartPivot(pivotConfig).map((row) => row.x);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddToDashboardDialogComponent, {
      width: '500px',
      data: this.data,
    });

    dialogRef.updatePosition({
      top: '10%',
    });
  }
}

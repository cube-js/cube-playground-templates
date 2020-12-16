import { Component, Input } from '@angular/core';
import { CubejsClient } from '@cubejs-client/ngx';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'query-renderer',
  templateUrl: './query-renderer.component.html',
  styles: [],
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

  ngOnInit() {}

  updateChartData(resultSet, pivotConfig) {
    if (!resultSet) {
      return;
    }
  }
}

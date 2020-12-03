import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { getDependencies, getCodesandboxFiles } from '../../code-chunks';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styles: [],
})
export class MainComponent implements OnInit {
  chartingLibrary = null;

  query$ = new BehaviorSubject<any>({});
  pivotConfig$ = new BehaviorSubject<any>(null);
  chartType$ = new BehaviorSubject<any>('line');

  constructor() {
    window['__cubejs'] = {
      getDependencies,
      getCodesandboxFiles,
    };
  }

  ngOnInit() {
    window.dispatchEvent(new CustomEvent('cubejsChartReady'));
  }

  @HostListener('window:cubejs', ['$event'])
  onCubejsEvent(event: any) {
    const { query, pivotConfig, chartType, chartingLibrary } = event.detail;

    if (query !== undefined) {
      this.query$.next(query);
    }
    if (pivotConfig !== undefined) {
      this.pivotConfig$.next(pivotConfig);
    }
    if (chartType) {
      this.chartType$.next(chartType);
    }
    if (chartingLibrary) {
      this.chartingLibrary = chartingLibrary;
    }
  }
}

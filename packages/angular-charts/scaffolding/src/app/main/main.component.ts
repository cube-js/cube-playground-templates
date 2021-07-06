import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { getDependencies, getCodesandboxFiles } from '../../code-chunks';

window['__cubejsPlayground'] = {
  getDependencies,
  getCodesandboxFiles,
};

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

  ngOnInit() {
    const queryId = window.location.hash.replace(/#\\/, '').split('=')[1];
    const { forQuery } = window.parent.window['__cubejsPlayground'] || {};
    const { onChartRendererReady } = forQuery(queryId);
    if (typeof onChartRendererReady === 'function') {
      onChartRendererReady();
    }
  }

  @HostListener('window:__cubejsPlaygroundEvent', ['$event'])
  onCubejsEvent(event: any) {
    const {
      query,
      pivotConfig,
      chartType,
      chartingLibrary,
      eventType,
    } = event.detail;

    if (eventType === 'chart') {
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
}

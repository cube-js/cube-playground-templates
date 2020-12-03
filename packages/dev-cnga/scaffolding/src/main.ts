import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// function dispatchChartEvent(detail) {
//   const myEvent = new CustomEvent('cubejs', {
//     bubbles: true,  // bubble event to containing elements
//     composed: true, // let the event pass through the shadowDOM boundary
//     detail
//   });

//   window.dispatchEvent(myEvent);
// }

// window['dispatchChartEvent'] = dispatchChartEvent;

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

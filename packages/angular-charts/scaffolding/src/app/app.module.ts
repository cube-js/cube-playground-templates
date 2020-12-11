import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CubejsClientModule } from '@cubejs-client/ngx';
import { ChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';

import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { AngularNg2Charts } from './angular-ng2-charts/query-renderer.component';
import { AngularTestCharts } from './angular-test-charts/query-renderer.component';

const API_URL = undefined;
const CUBEJS_TOKEN = undefined;

const { apiUrl, token } = window.parent.window['__cubejs'] || {};

const cubejsOptions = {
  token: token || CUBEJS_TOKEN,
  options: {
    apiUrl: apiUrl || API_URL,
  },
};

@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    AngularNg2Charts,
    AngularTestCharts,
  ],
  imports: [
    BrowserModule,
    CubejsClientModule.forRoot(cubejsOptions),
    ChartsModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule {}

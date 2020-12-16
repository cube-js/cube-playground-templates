import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CubejsClientModule } from '@cubejs-client/ngx';
import { ChartsModule } from 'ng2-charts';

import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { Ng2ChartRendererComponent } from './ng2-chart-renderer/chart-renderer.component';
import { RechartsChartRendererComponent } from './recharts-chart-renderer/chart-renderer.component';

const cubejsOptions = {
  token: 'CUBEJS_TOKEN',
  options: {
    apiUrl: `http://localhost:4000/cubejs-api/v1`,
  },
};

@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    Ng2ChartRendererComponent,
    RechartsChartRendererComponent,
  ],
  imports: [
    BrowserModule,
    CubejsClientModule.forRoot(cubejsOptions),
    ChartsModule,
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule {}

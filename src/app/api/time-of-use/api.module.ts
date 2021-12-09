/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ConfigurationService } from './services/configuration.service';
import { DayService } from './services/day.service';
import { DayActionService } from './services/day-action.service';
import { SeasonService } from './services/season.service';
import { SpecialDayService } from './services/special-day.service';
import { TimeOfUseService } from './services/time-of-use.service';
import { WeekService } from './services/week.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    ConfigurationService,
    DayService,
    DayActionService,
    SeasonService,
    SpecialDayService,
    TimeOfUseService,
    WeekService,
    ApiConfiguration
  ]
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ApiModule, @Optional() http: HttpClient) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' + 'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}

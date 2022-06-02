/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { DisconnectorConfigService } from './services/disconnector-config.service';
import { LicensingService } from './services/licensing.service';
import { UserGridConfigService } from './services/user-grid-config.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [DisconnectorConfigService, LicensingService, UserGridConfigService, ApiConfiguration]
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

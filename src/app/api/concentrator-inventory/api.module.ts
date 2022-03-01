/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { InventoryHealthCheckService } from './services/inventory-health-check.service';
import { ConcentratorService } from './services/concentrator.service';
import { DeviceService } from './services/device.service';
import { MeterPropertyService } from './services/meter-property.service';
import { DeviceImportService } from './services/device-import.service';
import { ValidationsService } from './services/validations.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    InventoryHealthCheckService,
    ConcentratorService,
    DeviceService,
    MeterPropertyService,
    DeviceImportService,
    ValidationsService,
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

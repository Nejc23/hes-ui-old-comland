/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from './api-configuration';
import { AppConfigService } from 'src/app/core/configuration/services/app-config.service';

/**
 * Base class for services
 */
@Injectable()
export class BaseService {
  constructor(protected config: ApiConfiguration, protected http: HttpClient) {}

  private _rootUrl: string = '';

  /**
   * Returns the root url for all operations in this service. If not set directly in this
   * service, will fallback to `ApiConfiguration.rootUrl`.
   */
  get rootUrl(): string {
    // Do not modify getter because this allows editing config.json on demand.
    if (AppConfigService.settings && AppConfigService.settings?.apiServer?.url !== '') {
      this._rootUrl = AppConfigService.settings?.apiServer?.url;
    }

    // Service API url.
    return (this._rootUrl || this.config.rootUrl) + '/api/data-processing';
  }

  /**
   * Sets the root URL for API operations in this service.
   */
  set rootUrl(rootUrl: string) {
    this._rootUrl = rootUrl;
  }
}

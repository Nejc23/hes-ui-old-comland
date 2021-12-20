/* tslint:disable */
/* eslint-disable */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/configuration/services/app-config.service';
import { ApiConfiguration } from './api-configuration';

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
    return (this._rootUrl || this.config.rootUrl) + '/api/time-of-use';
  }

  /**
   * Sets the root URL for API operations in this service.
   */
  set rootUrl(rootUrl: string) {
    this._rootUrl = rootUrl;
  }
}

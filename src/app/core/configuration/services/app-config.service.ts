import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfig } from '../interfaces/app-config.interface';
import { AppConfigStoreService } from './app-config-store.service';

@Injectable()
export class AppConfigService {
  static settings: IAppConfig;
  lang = 'en';

  constructor(private http: HttpClient, private appConfigStoreService: AppConfigStoreService) {
    this.lang = localStorage.getItem('lang');
  }

  loadAppConfig() {
    return this.http
      .get(`/assets/config/config.json`)
      .toPromise()
      .then((data) => {
        AppConfigService.settings = data as IAppConfig;
        this.appConfigStoreService.setConfig(data as IAppConfig);
      });
  }
}

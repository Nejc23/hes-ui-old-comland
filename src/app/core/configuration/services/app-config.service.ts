import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from '../interfaces/app-config.interface';
import { AppConfigStoreService } from './app-config-store.service';
import { environment } from 'src/environments/environment';
import { Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

@Injectable()
export class AppConfigService {
  static settings: IAppConfig;

  constructor(private http: HttpClient, private appConfigStoreService: AppConfigStoreService, @Inject(LOCALE_ID) public locale: string) {}

  loadAppConfig() {
    return this.http
      .get(environment.ignoreLocale ? `/assets/config/config.json` : `/${this.locale}/assets/config/config.json`)
      .toPromise()
      .then((data) => {
        AppConfigService.settings = data as IAppConfig;
        this.appConfigStoreService.setConfig(data as IAppConfig);
      });
  }
}

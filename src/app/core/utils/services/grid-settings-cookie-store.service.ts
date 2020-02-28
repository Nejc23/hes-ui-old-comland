import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class GridSettingsCookieStoreService {
  constructor(private cookieService: CookieService) {}

  setGridColumnsSettings(gridId: string, state) {
    // this.cookieService.delete('gridSettings')
    this.cookieService.set(gridId, JSON.stringify(state), null, environment.cookiePath);
    console.log(this.cookieService.get(gridId));
  }

  getGridColumnsSettings(gridId: string) {
    // this.cookieService.delete(this.gridSettings);
    if (this.cookieService.check(gridId)) {
      return JSON.parse(this.cookieService.get(gridId));
    }
    return '';
  }
}

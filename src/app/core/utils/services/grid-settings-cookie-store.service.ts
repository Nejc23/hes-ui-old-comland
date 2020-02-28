import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class GridSettingsCoockieStoreService {
  gridSettings = 'gridSettings';

  constructor(private cookieService: CookieService) {}

  setGridColumnsSettings(gridId: string, state) {
    // this.cookieService.delete('columnSettings')
    if (this.cookieService.check(this.gridSettings)) {
      const data = JSON.parse(this.cookieService.get(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          value.value = state;
          this.cookieService.set(this.gridSettings, JSON.stringify(data), null, environment.cookiePath);
        } else {
          data.push({
            id: gridId,
            value: state
          });
          this.cookieService.set(this.gridSettings, JSON.stringify(data), null, environment.cookiePath);
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: state
        }
      ];
      this.cookieService.set(this.gridSettings, JSON.stringify(data), null, environment.cookiePath);
    }
  }

  getGridColumnsSettings(gridId: string) {
    if (this.cookieService.check(this.gridSettings)) {
      const data = JSON.parse(this.cookieService.get(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          return JSON.parse(value.value);
        }
      }
    }
    return '';
  }
}

import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { SidebarAnimationState } from '../../consts/sidebar-animation.const';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

@Injectable()
export class SidebarCookieStoreService {
  sidebarLayoutName = 'sidebarLayout';

  constructor(private cookieService: CookieService) {}
  // filter
  setSidebarLayout(menuName: string, state: SidebarAnimationState) {
    if (this.cookieService.get(this.sidebarLayoutName)) {
      const data = JSON.parse(this.cookieService.get(this.sidebarLayoutName));
      if (data) {
        const value = _.find(data, (x) => x.id === menuName);
        if (value) {
          value.value.state = state;
          this.cookieService.set(this.sidebarLayoutName, JSON.stringify(data), this.getOneYearFromNow());
        } else {
          data.push({
            id: menuName,
            value: {
              state
            }
          });
          this.cookieService.set(this.sidebarLayoutName, JSON.stringify(data), this.getOneYearFromNow());
        }
      }
    } else {
      const data = [
        {
          id: menuName,
          value: {
            state
          }
        }
      ];
      this.cookieService.set(this.sidebarLayoutName, JSON.stringify(data), this.getOneYearFromNow());
    }
  }

  // clearSidebarLayout() {
  //   console.log('clearSidebarLayout() called');
  //   this.cookieService.(this.sidebarLayoutName);
  // }

  getSidebarLayout(menuName: string): SidebarAnimationState {
    if (this.cookieService.get(this.sidebarLayoutName)) {
      const data = JSON.parse(this.cookieService.get(this.sidebarLayoutName));
      if (data) {
        const value = _.find(data, (x) => x.id === menuName);
        if (value) {
          return value.value.state;
        }
      }
    }
    return SidebarAnimationState.close;
  }

  getOneYearFromNow(): Date {
    return moment().add(1, 'year').toDate();
  }
}

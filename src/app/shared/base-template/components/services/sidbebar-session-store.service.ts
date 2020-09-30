import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { SidebarAnimationState } from '../../consts/sidebar-animation.const';

@Injectable()
export class SidebarSessionStoreService {
  sidebarLayoutName = 'sidebarLayout';

  constructor() {}
  // filter
  setSidebarLayout(menuName: string, state: SidebarAnimationState) {
    if (sessionStorage.getItem(this.sidebarLayoutName)) {
      const data = JSON.parse(sessionStorage.getItem(this.sidebarLayoutName));
      if (data) {
        const value = _.find(data, x => x.id === menuName);
        if (value) {
          value.value.state = state;
          sessionStorage.setItem(this.sidebarLayoutName, JSON.stringify(data));
          console.log('data stored:', ...data);
        } else {
          data.push({
            id: menuName,
            value: {
              state
            }
          });
          sessionStorage.setItem(this.sidebarLayoutName, JSON.stringify(data));
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
      sessionStorage.setItem(this.sidebarLayoutName, JSON.stringify(data));
    }
  }

  clearSidebarLayout() {
    sessionStorage.removeItem(this.sidebarLayoutName);
  }

  getSidebarLayout(menuName: string): SidebarAnimationState {
    if (sessionStorage.getItem(this.sidebarLayoutName)) {
      const data = JSON.parse(sessionStorage.getItem(this.sidebarLayoutName));
      if (data) {
        const value = _.find(data, x => x.id === menuName);
        if (value) {
          return value.value.state;
        }
      }
    }
    return SidebarAnimationState.close;
  }
}

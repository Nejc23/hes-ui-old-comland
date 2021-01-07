import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class GridLayoutSessionStoreService {
  gridLayoutName = 'gridLayout';

  constructor() {}
  // filter
  setGridLayout(gridId: string, layoutNew: any) {
    if (sessionStorage.getItem(this.gridLayoutName)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridLayoutName));
      if (data) {
        const value = _.find(data, (x) => x.id === gridId);
        if (value) {
          value.value.filter = layoutNew;
          sessionStorage.setItem(this.gridLayoutName, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: {
              filter: layoutNew
            }
          });
          sessionStorage.setItem(this.gridLayoutName, JSON.stringify(data));
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: {
            filter: layoutNew
          }
        }
      ];
      sessionStorage.setItem(this.gridLayoutName, JSON.stringify(data));
    }
  }

  clearGridLayout() {
    sessionStorage.removeItem(this.gridLayoutName);
  }

  getGridLayout(gridId: string) {
    if (sessionStorage.getItem(this.gridLayoutName)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridLayoutName));
      if (data) {
        const value = _.find(data, (x) => x.id === gridId);
        if (value) {
          return value.value.filter;
        }
      }
    }
    return '';
  }
}

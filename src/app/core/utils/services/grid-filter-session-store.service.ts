import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class GridFilterSessionStoreService {
  gridFilterName = 'gridFilter';

  constructor() {}
  // filter
  setGridFilter(gridId: string, filterNew: any) {
    if (sessionStorage.getItem(this.gridFilterName)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridFilterName));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          value.value.filter = filterNew;
          sessionStorage.setItem(this.gridFilterName, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: {
              filter: filterNew
            }
          });
          sessionStorage.setItem(this.gridFilterName, JSON.stringify(data));
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: {
            filter: filterNew
          }
        }
      ];
      sessionStorage.setItem(this.gridFilterName, JSON.stringify(data));
    }
  }

  getGridFilter(gridId: string) {
    if (sessionStorage.getItem(this.gridFilterName)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridFilterName));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          return value.value.filter;
        }
      }
    }
    return '';
  }
}

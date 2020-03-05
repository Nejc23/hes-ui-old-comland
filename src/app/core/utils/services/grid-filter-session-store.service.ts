import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class GridFilterSessionStoreService {
  gridFilter = 'gridFilter';

  constructor() {}
  // filter
  setGridFilter(gridId: string, gridFilter: any) {
    if (sessionStorage.getItem(this.gridFilter)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridFilter));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          value.value.gridFilter = gridFilter;
          sessionStorage.setItem(this.gridFilter, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: {
              filter: gridFilter
            }
          });
          sessionStorage.setItem(this.gridFilter, JSON.stringify(data));
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: {
            filter: gridFilter
          }
        }
      ];
      sessionStorage.setItem(this.gridFilter, JSON.stringify(data));
    }
  }

  getGridFilter(gridId: string) {
    if (sessionStorage.getItem(this.gridFilter)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridFilter));
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

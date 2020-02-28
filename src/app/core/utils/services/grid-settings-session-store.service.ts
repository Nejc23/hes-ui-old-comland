import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class GridSettingsSessionStoreService {
  gridSettings = 'gridSettings';

  constructor() {}
  // searchText
  // pageIndex
  setGridSearchText(gridId: string, searchText: string) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          value.value.searchText = searchText;
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: {
              searchText,
              pageIndex: 0
            }
          });
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: {
            searchText,
            pageIndex: 0
          }
        }
      ];
      sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
    }
  }

  getGridSearchText(gridId: string) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          return value.value.searchText;
        }
      }
    }
    return '';
  }

  setGridPageIndex(gridId: string, pageIndex: number) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          value.value.pageIndex = pageIndex;
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: {
              pageIndex,
              searchText: ''
            }
          });
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: {
            pageIndex,
            searchText: ''
          }
        }
      ];
      sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
    }
  }

  getGridPageIndex(gridId: string) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          return value.value.pageIndex;
        }
      }
    }
    return 0;
  }
}

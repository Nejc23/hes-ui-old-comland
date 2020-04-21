import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { GridSettingsSessionStore } from '../interfaces/grid-settings-session-store.interface';
import { GridSettingsSessionStoreTypeEnum } from '../enums/grid-settings-session-store.enum';

@Injectable()
export class GridSettingsSessionStoreService {
  gridSettings = 'gridSettings';

  constructor() {}
  // searchText
  // pageIndex
  /* setGridSearchText(gridId: string, searchText: string) {
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
              pageIndex: 0,
              selectedRows: []
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
            pageIndex: 0,
            selectedRows: []
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
              searchText: '',
              selectedRows: []
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
            searchText: '',
            selectedRows: []
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

  setSelectedRows(gridId: string, selectedRows: any) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          value.value.selectedRows = selectedRows;
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: {
              pageIndex: 0,
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
            pageIndex: 0,
            searchText: '',
            selectedRows: []
          }
        }
      ];
      sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
    }
  }

  getSelectedRows(gridId: string) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          return value.value.selectedRows;
        }
      }
    }
    return 0;
  }
*/

  /**************************************** */

  setGridSettings(gridId: string, type: GridSettingsSessionStoreTypeEnum, object: GridSettingsSessionStore) {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          switch (type) {
            case GridSettingsSessionStoreTypeEnum.searchString:
              value.value.searchText = object.searchText;
              break;
            case GridSettingsSessionStoreTypeEnum.pageIndex:
              value.value.pageIndex = object.pageIndex;
              break;
            case GridSettingsSessionStoreTypeEnum.selectedRows:
              value.value.selectedRows = object.selectedRows;
              break;
            case GridSettingsSessionStoreTypeEnum.isSelectedAll:
              value.value.isSelectedAll = object.isSelectedAll;
              break;
          }
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        } else {
          data.push({
            id: gridId,
            value: object as GridSettingsSessionStore
          });
          sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
        }
      }
    } else {
      const data = [
        {
          id: gridId,
          value: {
            searchText: '',
            pageIndex: 0,
            selectedRows: [],
            isSelectedAll: false
          } as GridSettingsSessionStore
        }
      ];
      sessionStorage.setItem(this.gridSettings, JSON.stringify(data));
    }
  }

  getGridSettings(gridId: string): GridSettingsSessionStore {
    if (sessionStorage.getItem(this.gridSettings)) {
      const data = JSON.parse(sessionStorage.getItem(this.gridSettings));
      if (data) {
        const value = _.find(data, x => x.id === gridId);
        if (value) {
          return value.value;
        }
      }
    }
    return {
      searchText: '',
      pageIndex: 0,
      selectedRows: [],
      isSelectedAll: false
    };
  }

  saveMyGridLinkRequestId(grid: string, requestId: string) {
    const requestIds = [];
    const data = JSON.parse(sessionStorage.getItem(grid));
    if (data) {
      data.map(row => requestIds.push(row));
      const value = _.find(data, x => x === requestId);
      if (!value) {
        requestIds.push(requestId);
        sessionStorage.setItem(grid, JSON.stringify(requestIds));
      }
    } else {
      requestIds.push(requestId);
      sessionStorage.setItem(grid, JSON.stringify(requestIds));
    }
    console.log(`requestIds = ${JSON.stringify(requestIds)}`);
  }

  removeMyGridLinkRequestId(grid: string, requestId: string) {
    const data = JSON.parse(sessionStorage.getItem(grid));
    if (data) {
      const value = _.find(data, x => x === requestId);
      if (value) {
        _.remove(data, x => x === requestId);
        sessionStorage.setItem(grid, JSON.stringify(data));
      }
    }
    // console.log(`requestIds = ${JSON.stringify(data)}`);
  }

  getAllMyGridLinkRequestIds(grid: string): string[] {
    const data = JSON.parse(sessionStorage.getItem(grid));
    return data;
  }
}

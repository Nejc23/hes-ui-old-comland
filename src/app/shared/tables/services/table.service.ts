import { Injectable } from '@angular/core';
import { TableRequest } from '../interfaces/table-request.interface';
import { TableQueryResponse } from '../interfaces/table-response.interface';
import { TableState } from '../models/table-state.model';
import * as _ from 'lodash';
import { TablePage } from '../interfaces/table-page.interface';
import { TableSort } from '../interfaces/table-sort.interface';
import { TableSortEvent } from '../interfaces/table-sort-event.interface';
import { TableMessage } from '../helpers/table-message.helper';
import { TableFilter } from '../interfaces/table-filter.interface';
import { SortPropDir } from '@swimlane/ngx-datatable/lib/types/sort-prop-dir.type';
import { SortDirection } from '@swimlane/ngx-datatable';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable()
export class TableService {
  constructor(private i18n: I18n) {}

  createStateFromResponse(state: TableState, response: TableQueryResponse<any>): TableState {
    const clone: TableState = _.clone(state);
    clone.tableRequest.pageSettings = _.clone(state.tableRequest.pageSettings);

    clone.tableRequest.pageSettings.offset = response.offset;
    clone.tableRequest.pageSettings.recordCount = response.recordCount;
    clone.rows = response.results;

    return clone;
  }

  setSortToState(state: TableState, sort: TableSortEvent) {
    return this.updateStateSort(state, {
      property: sort.column.prop,
      descending: sort.newValue === SortDirection.desc
    });
  }

  updateTableSettings(state: TableState, tableRequest: TableRequest): TableState {
    const updatedState = {
      ...state,
      tableRequest: {
        ...state.tableRequest,
        ...tableRequest
      }
    };

    return updatedState;
  }

  updatePageSettings(state: TableState, tablePage: TablePage): TableState {
    const updatedState = {
      ...state,
      tableRequest: {
        ...state.tableRequest,
        pageSettings: {
          ...state.tableRequest.pageSettings,
          ...tablePage
        }
      }
    };

    return updatedState;
  }

  updateStateSort(state: TableState, sort: TableSort): TableState {
    const updatedState = {
      ...state,
      tableRequest: {
        ...state.tableRequest,
        sort
      }
    };

    return updatedState;
  }

  createStartingState(state: TableState, defaultSort: SortPropDir, initialPageSize: number) {
    const isDescending = defaultSort.dir === SortDirection.desc;
    const property = defaultSort.prop as string;

    const updatedInitializedState = { ...state, isInitialized: true };

    const newStateWithSort = this.updateStateSort(
      {
        ...updatedInitializedState,
        initialSort: defaultSort
      },
      { descending: isDescending, property }
    );

    const resultingState = this.updatePageSettings(newStateWithSort, {
      ...newStateWithSort.tableRequest.pageSettings,
      pageSize: initialPageSize
    });

    return resultingState;
  }

  changePageSize(state: TableState, pageSize: number) {
    return this.updatePageSettings(state, { ...state.tableRequest.pageSettings, pageSize, offset: 0 });
  }

  changeCurrentPage(state: TableState, page: number) {
    return this.updatePageSettings(state, { ...state.tableRequest.pageSettings, offset: page });
  }

  changeFilters(state: TableState, filters: TableFilter<string | number | boolean>[]) {
    return this.updateTableSettings(state, { ...state.tableRequest, filters });
  }

  translateTableMessages() {
    return new TableMessage(this.i18n('No table records'), this.i18n('all table records'), this.i18n('selected table records'));
  }
}

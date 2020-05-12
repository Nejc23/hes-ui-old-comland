import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsGridService {
  columns = [];

  constructor(private i18n: I18n) {}

  setGridDefaultColumns() {
    return [
      {
        field: 'type',
        suppressMenu: true,
        pinned: true
      },
      {
        field: 'running',
        suppressMenu: true,
        pinned: true
      },
      {
        field: 'triggerInfo',
        suppressMenu: true,
        pinned: true
      },
      {
        field: 'timeInfo',
        suppressMenu: true,
        pinned: true
      }
    ];
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridService {
  constructor(private i18n: I18n) {}

  columns = [];

  public setGridDefaultColumns() {
    this.columns = [
      { dataField: 'id', caption: 'ID', fixed: true, width: 20, visible: false },
      { dataField: 'status', caption: this.i18n('Status'), fixed: true, width: 100 },
      { dataField: 'nextRead', caption: '', fixed: true, width: 60, cellTemplate: 'cellTemplateNextReadIcon' },
      { dataField: 'name', caption: this.i18n('Name'), fixed: true, width: 180, cellTemplate: 'cellTemplateName' },
      { dataField: 'metersValue', caption: this.i18n('Meters'), fixed: true, width: 120, cellTemplate: 'cellTemplateMeters' },
      {
        dataField: 'readStatusPercent',
        caption: this.i18n('Read status'),
        fixed: true,
        width: 100,
        cellTemplate: 'cellTemplateReadStatus'
      },
      { dataField: 'type', caption: this.i18n('Type'), fixed: false, width: 120 },
      { dataField: 'vendor', caption: this.i18n('Vendor'), fixed: false, width: 120 },
      { dataField: 'idNumber', caption: this.i18n('ID'), fixed: false, width: 150 },
      { dataField: 'ip', caption: this.i18n('IP'), fixed: false, width: 150 },
      { dataField: 'lastCommunication', caption: this.i18n('Last communication'), fixed: false, width: 200 },
      { dataField: 'tags', caption: this.i18n('Tags'), fixed: false }
    ];
    return this.columns;
  }

  /// TODO ! set and save to BE
  /**
   * Set visible columns
   */
  public setCustomVisibilityGridColumns() {
    return this.columns;
  }

  /// TODO ! set and save to BE
  /**
   * Set pinned columns
   */
  public setCustomPinnedGridColumns() {
    return this.columns;
  }
}

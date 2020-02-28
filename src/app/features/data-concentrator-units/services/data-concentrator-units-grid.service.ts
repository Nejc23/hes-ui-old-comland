import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import CustomStore from 'devextreme/data/custom_store';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { BehaviorSubject } from 'rxjs';
import { enumSearchFilterOperators, enumGridOperations } from 'src/environments/config';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridService {
  columns = [];
  paramsDCU = {} as GridRequestParams;

  private countItems = new BehaviorSubject<number>(0);

  constructor(private i18n: I18n, private dataConcentratorUnitsService: DataConcentratorUnitsService) {}

  /**
   *  set grid columns
   */
  public setGridDefaultColumns() {
    this.columns = [
      { dataField: 'id', caption: 'ID', fixed: true, width: 20, visible: false },
      { id: 'status', dataField: 'status', caption: this.i18n('Status'), fixed: true, width: 100, title: 'status' },
      { dataField: 'nextRead', caption: '', fixed: true, width: 60, cellTemplate: 'cellTemplateNextReadIcon' },
      { dataField: 'name', caption: this.i18n('Name'), fixed: true, width: 180, cellTemplate: 'cellTemplateName' },
      { dataField: 'metersValue', caption: this.i18n('Meters'), fixed: true, width: 120, cellTemplate: 'cellTemplateMeters' },
      {
        dataField: 'readStatusPercent',
        caption: this.i18n('Read status'),
        fixed: true,
        width: 120,
        sortOrder: 'desc',
        cellTemplate: 'cellTemplateReadStatus'
      },
      { dataField: 'type', caption: this.i18n('Type'), fixed: false, width: 120 },
      { dataField: 'vendor', caption: this.i18n('Vendor'), fixed: false, width: 120 },
      { dataField: 'idNumber', caption: this.i18n('ID'), fixed: false, width: 150 },
      { dataField: 'ip', caption: this.i18n('IP'), fixed: false, width: 150, cellTemplate: 'cellTemplateIp' },
      {
        dataField: 'lastCommunication',
        caption: this.i18n('Last communication'),
        fixed: false,
        width: 200,
        cellTemplate: 'cellTemplateLastCommunication'
      },
      { dataField: 'tags', caption: this.i18n('Tags'), fixed: false, cellTemplate: 'cellTemplateTags' }
    ];
    return this.columns;
  }

  /**
   * Load data to grid
   */
  public loadData(search: string): CustomStore {
    this.paramsDCU.sort = [];

    function isNotEmpty(value: any): boolean {
      return value !== undefined && value !== null && value !== '';
    }

    return new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        [
          enumGridOperations.skip,
          enumGridOperations.take,
          enumGridOperations.requireTotalCount,
          enumGridOperations.requireGroupCount,
          enumGridOperations.sort
        ].forEach(i => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            switch (i) {
              case enumGridOperations.skip:
                this.paramsDCU.skip = loadOptions[i];
                break;
              case enumGridOperations.take:
                this.paramsDCU.take = loadOptions[i];
                break;
              case enumGridOperations.sort:
                // possible multiple sort
                loadOptions[i].forEach(element => {
                  this.paramsDCU.sort.push({
                    selector: element.selector,
                    desc: element.desc
                  });
                });
                break;
            }
          }
        });
        // add external filters
        //    this.setFilters();

        // add external search
        this.setSearch(search);

        return this.dataConcentratorUnitsService
          .getGridDCU(this.paramsDCU)
          .toPromise()
          .then((data: any) => {
            // set observable value
            this.countItems.next(data.totalCount);
            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount,
              searchText: search
            };
          })
          .catch(error => {
            throw new Error('Data Loading Error');
          });
      }
    });
  }

  // set external filters
  /* setFilters(companyId: number) {
    this.paramsDCU.filter = [];
    this.paramsDCU.filter.push({
      selector: 'companyId',
      operation: enumSearchFilterOperators.equal,
      value: companyId.toString()
    });
  }*/

  setSearch(search: string) {
    this.paramsDCU.search = [];
    this.paramsDCU.search.push({
      selector: 'all',
      value: search
    });
  }

  // return value to all subscribed
  get totalItems() {
    return this.countItems.asObservable();
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

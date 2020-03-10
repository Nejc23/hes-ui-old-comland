import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { enumGridOperations, configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellMetersComponent } from '../components/grid-custom-components/grid-cell-meters.component';
import { GridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
import { GridCellLastCommunicationComponent } from '../components/grid-custom-components/grid-cell-last-communication.component';
import { GridCellTagsComponent } from '../components/grid-custom-components/grid-cell-tags.component';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { DataConcentratorUnitsGridEventEmitterService } from './data-concentrator-units-grid-event-emitter.service';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridService {
  cookieNameForGridSettings = 'grdColDCU';

  columns = [];
  paramsDCU = {} as GridRequestParams;

  // private countItems = new BehaviorSubject<number>(0);

  constructor(
    private i18n: I18n,
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private dataConcentratorUnitsGridEventEmitorService: DataConcentratorUnitsGridEventEmitterService
  ) {}

  /**
   *  grid columns settings
   */
  public setGridDefaultColumns() {
    /*this.columns = [
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

*/
    return [
      { headerComponentFramework: GridSelectionHeaderComponent, pinned: true, width: 20 },
      { field: 'id', headerName: 'ID', pinned: true, width: 20, sortable: true, hide: true },
      {
        field: 'status',
        headerName: this.i18n('Status'),
        pinned: true,
        width: 55,
        sortable: false,
        cellRenderer: 'gridCellStatusComponent'
      },
      {
        field: 'name',
        headerName: this.i18n('Name'),
        pinned: true,
        width: 70,
        sortable: true,
        filter: false,
        search: false,
        cellRenderer: 'gridCellNameComponent'
      },
      {
        field: 'metersValue',
        headerName: this.i18n('Meters'),
        pinned: true,
        width: 60,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellMetersComponent'
      },
      {
        field: 'readStatusPercent',
        headerName: this.i18n('Read status'),
        pinned: true,
        width: 60,
        sortable: true,
        filter: false,
        sort: 'desc',
        cellRenderer: 'gridCellReadStatusComponent'
      },
      { field: 'type', headerName: this.i18n('Type'), pinned: false, width: 40, sortable: true, filter: false },
      { field: 'vendor', headerName: this.i18n('Vendor'), pinned: false, width: 50, sortable: true, filter: false },
      { field: 'idNumber', headerName: this.i18n('ID'), pinned: false, width: 50, sortable: true, filter: false },
      { field: 'ip', headerName: this.i18n('IP'), pinned: false, width: 50, sortable: true, filter: false },
      {
        field: 'lastCommunication',
        headerName: this.i18n('Last communication'),
        pinned: false,
        width: 70,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellLastCommunicationComponent'
      },
      { field: 'tags', headerName: this.i18n('Tags'), pinned: false, sortable: true, filter: false, cellRenderer: 'gridCellTagsComponent' }
    ];
  }

  // templates for grid
  setFrameworkComponents() {
    return {
      gridCellStatusComponent: GridCellStatusComponent,
      gridCellReadStatusComponent: GridCellReadStatusComponent,
      gridCellMetersComponent: GridCellMetersComponent,
      gridCellNameComponent: GridCellNameComponent,
      gridCellLastCommunicationComponent: GridCellLastCommunicationComponent,
      gridCellTagsComponent: GridCellTagsComponent
    };
  }

  // grid settings
  setGridOptions() {
    return {
      rowModelType: configAgGrid.rowModelType,
      defaultColDef: {
        sortable: configAgGridDefCol.sortable,
        resizable: configAgGridDefCol.resizable,
        suppressFiltersToolPanel: configAgGridDefCol.suppressFiltersToolPanel,
        suppressColumnsToolPanel: configAgGridDefCol.suppressColumnsToolPanel,
        floatingFilterComponentParams: configAgGridDefCol.floatingFilterComponentParams,
        checkboxSelection: isFirstColumn
      },
      //  cacheBlockSize: 5,
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug,
      onColumnMoved: this.onColumnMovedd,
      onColumnResized: this.onColumnMovedd,
      onColumnPinned: this.onColumnMovedd
    };
  }

  onColumnMovedd = params => {
    console.log(this.gridSettingsCookieStoreService);
    this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());

    /*  console.log(params);
    const columnState = JSON.stringify(params.columnApi.getColumnState());
    localStorage.setItem('myColumnState', columnState);*/
  };

  getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }

  /**
   * Load data to grid
   */
  /*public loadData(search: string): CustomStore {
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
          .getGridDcu(this.paramsDCU)
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
*/
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
  /* get totalItems() {
    return this.countItems.asObservable();
  }
*/
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

// extra functions gor grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}

import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellMetersComponent } from '../components/grid-custom-components/grid-cell-meters.component';
import { GridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
import { GridCellLastCommunicationComponent } from '../components/grid-custom-components/grid-cell-last-communication.component';
import { GridCellTagsComponent } from '../components/grid-custom-components/grid-cell-tags.component';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridCustomFilterComponent } from '../components/grid-custom-components/grid-custom-filter.component';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridService {
  cookieNameForGridSettings = 'grdColDCU';

  columns = [];
  paramsDCU = {} as GridRequestParams;

  constructor(private i18n: I18n, private gridSettingsCookieStoreService: GridSettingsCookieStoreService) {}

  /**
   *  grid columns settings
   */
  public setGridDefaultColumns(sample: boolean) {
    return [
      {
        headerComponentFramework: GridSelectionHeaderComponent,
        pinned: true,
        width: 20,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        cellStyle: localStorage.getItem('lockCheckBox') === 'true' ? { 'pointer-events': 'none' } : ''
      },
      { field: 'id', headerName: 'ID', pinned: true, width: 20, sortable: true, hide: true, suppressColumnsToolPanel: true },
      {
        field: 'status',
        headerName: this.i18n('Status'),
        pinned: true,
        width: 55,
        sortable: false,
        cellRenderer: 'gridCellStatusComponent',
        filter: 'agTextColumnFilter'
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
  public setFrameworkComponents() {
    return {
      gridCellStatusComponent: GridCellStatusComponent,
      gridCellReadStatusComponent: GridCellReadStatusComponent,
      gridCellMetersComponent: GridCellMetersComponent,
      gridCellNameComponent: GridCellNameComponent,
      gridCellLastCommunicationComponent: GridCellLastCommunicationComponent,
      gridCellTagsComponent: GridCellTagsComponent,
      gridCustomFilterComponent: GridCustomFilterComponent
    };
  }

  // grid settings
  public setGridOptions() {
    return {
      rowModelType: configAgGrid.rowModelType,
      defaultColDef: {
        sortable: configAgGridDefCol.sortable,
        resizable: configAgGridDefCol.resizable,
        floatingFilterComponentParams: configAgGridDefCol.floatingFilterComponentParams,
        checkboxSelection: isFirstColumn,
        filter: true
      },
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug,
      onColumnMoved: this.onColumnMoved,
      onColumnResized: this.onColumnMoved,
      onColumnPinned: this.onColumnMoved
    };
  }

  public setSideBar() {
    return {
      toolPanels: [
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'gridCustomFilterComponent',
          toolPanelParams: {
            suppressExpandAll: true,
            suppressFilterSearch: true
          }
        },
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnExpandAll: true
          }
        }
      ]
    };
  }

  public onColumnVisibility(params) {
    this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  }

  private onColumnMoved = params => {
    this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}

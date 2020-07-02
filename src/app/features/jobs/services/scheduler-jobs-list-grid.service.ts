import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { GridCellActiveComponent } from '../components/grid-custom-components/grid-cell-active.component';
import { GridCellNextRunComponent } from '../components/grid-custom-components/grid-cell-next-run.component';
import { GridCellDeleteComponent } from '../components/grid-custom-components/grid-cell-delete-btn.component';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridPagination } from '../../meter-units/types/interfaces/grid-pagination.interface';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridCellEditComponent } from '../components/grid-custom-components/grid-cell-edit-btn.component';

@Injectable({
  providedIn: 'root'
})
export class SchedulerJobsListGridService {
  sessionNameForGridState = 'grdJobs-scheduled';

  columns = [];
  paramsJobs = {} as GridRequestParams;

  constructor(private i18n: I18n, private gridSettingsSessionStoreService: GridSettingsSessionStoreService) {}

  /**
   *  Set templates for grid
   */
  public setFrameworkComponents() {
    return {
      gridCellActiveComponent: GridCellActiveComponent,
      gridCellNextRunComponent: GridCellNextRunComponent,
      gridCellDeleteComponent: GridCellDeleteComponent,
      gridCellEditComponent: GridCellEditComponent
    };
  }

  /**
   * Grid columns settings
   */
  setGridDefaultColumns() {
    return [
      {
        width: 100,
        suppressMenu: true,
        suppressMovable: true,
        lockPosition: true,
        field: 'active',
        cellRenderer: 'gridCellActiveComponent',
        headerName: this.i18n('Active'),
        headerTooltip: this.i18n('Active'),
        minWidth: 100,
        maxWidth: 100
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Job Type'),
        headerTooltip: this.i18n('Job Type')
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Description'),
        headerTooltip: this.i18n('Description')
      },
      {
        field: 'nextRun',
        suppressMenu: true,
        sortable: false,
        suppressMovable: true,
        lockPosition: true,
        cellRenderer: 'gridCellNextRunComponent',
        headerName: this.i18n('Next run'),
        headerTooltip: this.i18n('Next run')
      },
      {
        field: 'owner',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Owner'),
        headerTooltip: this.i18n('Owner')
      },
      {
        field: 'id',
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        cellRenderer: 'gridCellEditComponent',
        headerName: '',
        headerTooltip: this.i18n('Owner')
      },
      {
        field: 'id',
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        cellRenderer: 'gridCellDeleteComponent',
        headerName: '',
        headerTooltip: this.i18n('Delete job')
      }
    ];
  }

  /**
   * Get grid pagination for current row
   * @returns GridPagination
   */
  public getCurrentRowIndex(): GridPagination {
    const index = this.getSessionSettingsPageIndex();
    const result: GridPagination = {
      currentPage: 0,
      startRow: 0,
      endRow: 10
    };

    if (index !== undefined && index !== null) {
      result.currentPage = index;
      result.startRow = index * 10;
      result.endRow = index * 10 + 10;
    }

    return result;
  }

  /**
   * Get searched text
   */
  public getSessionSettingsSearchedText() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchText;
  }

  /**
   * Set searched text
   * @param text search text
   */
  public setSessionSettingsSearchedText(text: string) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.searchText = text;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.searchString,
      settings
    );
  }

  /**
   * Get page index
   */
  public getSessionSettingsPageIndex() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.pageIndex;
  }

  /**
   * Set page index
   * @param index page index
   */
  public setSessionSettingsPageIndex(index: number) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.pageIndex = index;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.pageIndex,
      settings
    );
  }

  /**
   * Set grid settings
   */
  public setGridOptions() {
    return {
      rowModelType: configAgGrid.rowModelType,
      defaultColDef: {
        sortable: configAgGridDefCol.sortable,
        resizable: configAgGridDefCol.resizable,
        floatingFilterComponentParams: configAgGridDefCol.floatingFilterComponentParams,
        checkboxSelection: false,
        filter: true
      },
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug
    };
  }
}

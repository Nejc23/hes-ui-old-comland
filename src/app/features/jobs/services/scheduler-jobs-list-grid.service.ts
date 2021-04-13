import { GridCellDeviceCountComponent } from './../components/grid-custom-components/grid-cell-device-count.component';
import { Injectable } from '@angular/core';
import { GridCellActiveComponent } from '../components/grid-custom-components/grid-cell-active.component';
import { GridCellNextRunComponent } from '../components/grid-custom-components/grid-cell-next-run.component';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridPagination } from '../../meter-units/types/interfaces/grid-pagination.interface';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridCellEditActionsComponent } from '../components/grid-custom-components/grid-cell-edit-actions.component';

@Injectable({
  providedIn: 'root'
})
export class SchedulerJobsListGridService {
  sessionNameForGridState = 'grdJobs-scheduled';

  columns = [];
  paramsJobs = {} as GridRequestParams;

  constructor(private gridSettingsSessionStoreService: GridSettingsSessionStoreService) {}

  /**
   *  Set templates for grid
   */
  public setFrameworkComponents() {
    return {
      gridCellActiveComponent: GridCellActiveComponent,
      gridCellNextRunComponent: GridCellNextRunComponent,
      gridCellEditActionsComponent: GridCellEditActionsComponent,
      gridCellDeviceCountComponent: GridCellDeviceCountComponent
    };
  }

  /**
   * Grid columns settings
   */
  setGridDefaultColumns() {
    return [
      {
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        suppressMenu: true,
        suppressMovable: true,
        field: 'active',
        cellRenderer: 'gridCellActiveComponent',
        headerName: $localize`Active`,
        headerTooltip: $localize`Active`,
        resizable: false
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: $localize`Description`,
        headerTooltip: $localize`Description`,
        resizable: false
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: $localize`Job Type`,
        headerTooltip: $localize`Job Type`,
        resizable: false
      },
      {
        field: 'nextRun',
        suppressMenu: true,
        sortable: false,
        suppressMovable: true,
        cellRenderer: 'gridCellNextRunComponent',
        headerName: $localize`Next run`,
        headerTooltip: $localize`Next run`,
        resizable: false
      },
      {
        field: 'owner',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: $localize`Created by`,
        headerTooltip: $localize`Created by`,
        resizable: false
      },
      {
        field: 'deviceCount',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellDeviceCountComponent',
        headerName: $localize`Devices`,
        headerTooltip: $localize`Devices`,
        resizable: false
      },
      {
        field: 'id',
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        lockPinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellEditActionsComponent',
        headerName: '',
        cellClass: 'actions-button-cell',
        resizable: false,
        pinned: 'right'
      }
    ];
  }

  /**
   * Get grid pagination for current row
   * @returns GridPagination
   */
  public getCurrentRowIndex(pageSize: number): GridPagination {
    const index = this.getSessionSettingsPageIndex();
    const result: GridPagination = {
      currentPage: 0,
      startRow: 0,
      endRow: pageSize
    };

    if (index !== undefined && index !== null) {
      result.currentPage = index;
      result.startRow = index * pageSize;
      result.endRow = index * pageSize + pageSize;
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

  public getSessionSettingsSearchedWildcards() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchWildcards;
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
   * Set searched wildcard
   * @param boolean search wildcard
   */
  public setSessionSettingsSearchedWildcards(searchWildcards: boolean) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.searchWildcards = searchWildcards;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.searchWildcards,
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

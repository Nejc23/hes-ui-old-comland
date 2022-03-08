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
import { TranslateService } from '@ngx-translate/core';
import { GridColumn, GridColumnType, GridRowAction } from '../../../shared/data-table/data-table.component';

@Injectable({
  providedIn: 'root'
})
export class SchedulerJobsListGridService {
  sessionNameForGridState = 'grdJobs-scheduled';

  columns: Array<GridColumn> = [
    {
      field: 'active',
      translationKey: 'GRID.ACTIVE',
      width: 65,
      type: GridColumnType.SWITCH,
      class: 'no-padding'
    },
    {
      field: 'description',
      translationKey: 'GRID.DESCRIPTION',
      width: 200
    },
    {
      field: 'type',
      translationKey: 'GRID.TYPE',
      width: 140
    },
    {
      field: 'nextRun',
      translationKey: 'GRID.NEXT-RUN',
      width: 100,
      type: GridColumnType.DATE_TIME
    },
    {
      field: 'owner',
      translationKey: 'GRID.CREATED-BY',
      width: 80
    },
    {
      field: 'deviceCount',
      translationKey: 'GRID.DEVICES',
      width: 80,
      type: GridColumnType.LINK,
      class: 'green-badge'
    }
  ];
  paramsJobs = {} as GridRequestParams;
  rowActions: Array<GridRowAction> = [
    {
      actionName: 'runJob',
      iconName: 'play-icon'
    },
    {
      actionName: 'editJob',
      iconName: 'edit'
    },
    {
      actionName: 'deleteJob',
      iconName: 'delete'
    }
  ];

  constructor(private gridSettingsSessionStoreService: GridSettingsSessionStoreService, private translate: TranslateService) {}

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

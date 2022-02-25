import { Injectable } from '@angular/core';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import * as _ from 'lodash';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { GridColumn, GridColumnType, GridRowAction } from '../../../../shared/data-table/data-table.component';
import { gridSysNameColumnsEnum } from '../../../global/enums/meter-units-global.enum';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeGridService {
  cookieNameForGridSettings = 'grdColMUT';
  cookieNameForGridSort = 'grdColMUTSort';
  sessionNameForGridState = 'grdStateMUT';
  gridName = 'grdMUT-requestIds';
  gridNameBreakerState = 'grdMUT-breaker-state-requestIds';
  gridNameCiiState = 'grdMUT-cii-state-requestIds';
  gridNameRelaysState = 'grdMUT-relays-state-requestIds';
  meterUnitsId: number;

  metersColumns: Array<GridColumn> = [
    {
      field: 'icons',
      translationKey: '',
      width: 95,
      sortingDisabled: true,
      class: 'no-padding',
      type: GridColumnType.ICONS,
      iconsData: [
        {
          field: gridSysNameColumnsEnum.templateId,
          iconName: 'warning-red-icon',
          popoverText: 'GRID.MISSING-TEMPLATE'
        },
        {
          field: gridSysNameColumnsEnum.readyForActivation,
          iconName: 'hourglass-icon',
          popoverText: 'GRID.READY-FOR-ACTIVATION'
        },
        {
          field: gridSysNameColumnsEnum.isHls,
          iconName: 'lock-icon',
          popoverText: 'GRID.HIGH-LEVEL-SECURITY'
        },
        {
          field: gridSysNameColumnsEnum.hasActiveJobs,
          iconName: 'clock-icon',
          popoverText: 'GRID.ACTIVE-JOBS'
        }
      ]
    },
    {
      field: gridSysNameColumnsEnum.jobStatus,
      translationKey: 'GRID.JOB-STATUS',
      width: 100,
      type: GridColumnType.JOB_STATUS
    },
    {
      field: gridSysNameColumnsEnum.state,
      translationKey: 'GRID.STATE',
      width: 120,
      type: GridColumnType.BOLD_TEXT
    },
    {
      field: gridSysNameColumnsEnum.protocolType,
      translationKey: 'GRID.PROTOCOL',
      width: 80
    },
    {
      field: gridSysNameColumnsEnum.name,
      translationKey: 'GRID.NAME',
      width: 200,
      type: GridColumnType.LINK
    },
    {
      field: gridSysNameColumnsEnum.serialNumber,
      translationKey: 'GRID.SERIAL-NUMBER',
      width: 200
    },
    {
      field: gridSysNameColumnsEnum.logicalDeviceName,
      translationKey: 'GRID.LOGICAL-DEVICE-NAME',
      width: 200
    },
    {
      field: gridSysNameColumnsEnum.moduleId,
      translationKey: 'GRID.MODULE-ID',
      width: 150
    },
    {
      field: gridSysNameColumnsEnum.parent,
      translationKey: 'GRID.PARENT',
      width: 200,
      type: GridColumnType.LINK
    },
    {
      field: gridSysNameColumnsEnum.parametrisationId,
      translationKey: 'GRID.PARAM-ID',
      width: 150
    },
    {
      field: gridSysNameColumnsEnum.timeOfUseId,
      translationKey: 'GRID.TIME-OF-USE-ID',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.vendor,
      translationKey: 'GRID.VENDOR',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.medium,
      translationKey: 'GRID.MEDIUM',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.firmware,
      translationKey: 'GRID.FIRMWARE',
      width: 140
    },
    {
      field: gridSysNameColumnsEnum.id1,
      translationKey: 'GRID.ID1',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id2,
      translationKey: 'GRID.ID2',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id3,
      translationKey: 'GRID.ID3',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id4,
      translationKey: 'GRID.ID4',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id5,
      translationKey: 'GRID.ID5',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id6,
      translationKey: 'GRID.ID6',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.configurationId,
      translationKey: 'GRID.ID-CONFIGURATION',
      width: 200
    },
    {
      field: gridSysNameColumnsEnum.disconnectorState,
      translationKey: 'GRID.DISCONNECTOR-STATE',
      width: 200,
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'connected',
          color: 'green'
        },
        {
          enumValue: 'readyforreconnection',
          color: 'blue'
        },
        {
          enumValue: 'disconnected',
          color: 'red'
        }
      ]
    },
    {
      field: gridSysNameColumnsEnum.instantValues,
      translationKey: 'GRID.RELAY',
      width: 100,
      type: GridColumnType.INSTANT_VALUES
    },
    {
      field: gridSysNameColumnsEnum.ciiState,
      translationKey: 'GRID.CII-STATE',
      width: 100,
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'on',
          color: 'green'
        },
        {
          enumValue: 'off',
          color: 'red'
        }
      ]
    },
    // {
    //   field: gridSysNameColumnsEnum.tags,
    //   translationKey: 'GRID.TAGS',
    //   width: 100
    // },
    {
      field: gridSysNameColumnsEnum.readStatusTimeStamp,
      translationKey: 'GRID.READ-STATUS',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.limiter1Normal.toLowerCase(),
      translationKey: 'GRID.LIMITER-1-NORMAL',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.limiter1Emergency.toLowerCase(),
      translationKey: 'GRID.LIMITER-1-EMERGENCY',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.limiter2Normal.toLowerCase(),
      translationKey: 'GRID.LIMITER-2-NORMAL',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.limiter2Emergency.toLowerCase(),
      translationKey: 'GRID.LIMITER-2-EMERGENCY',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.currentL1.toLowerCase(),
      translationKey: 'GRID.CURRENT-L1',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.currentL2.toLowerCase(),
      translationKey: 'GRID.CURRENT-L2',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.currentL3.toLowerCase(),
      translationKey: 'GRID.CURRENT-L3',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    }
  ];

  metersRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'details',
      iconName: 'eye-icon'
    },
    {
      actionName: 'registers',
      iconName: 'chart-icon'
    }
  ];

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private gridColumnShowHideService: GridColumnShowHideService
  ) {}

  public set meterUnitsTypeId(id: number) {
    this.meterUnitsId = id;
    this.cookieNameForGridSettings = this.cookieNameForGridSettings.includes('grdColMUT') ? this.cookieNameForGridSettings : 'grdColMUT';
    this.cookieNameForGridSort = this.cookieNameForGridSort.includes('grdColMUTSort') ? this.cookieNameForGridSort : 'grdColMUTSort';
    this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT') ? this.sessionNameForGridState : 'grdStateMUT';
  }

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }

  // is selected all
  public getSessionSettingsSelectedAll() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.isSelectedAll;
  }

  // set is selected all
  public setSessionSettingsSelectedAll(selectAll: boolean) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.isSelectedAll = selectAll;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.isSelectedAll,
      settings
    );
  }

  // selected rows
  public getSessionSettingsSelectedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.selectedRows;
  }

  // get stored grid settings from session configuration
  // ---------------------------------------------------------

  // set selected rows
  public setSessionSettingsSelectedRows(selectedRow: any) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (selectedRow.selected !== undefined && selectedRow.selected) {
      if (!_.find(settings.selectedRows, (x) => x.deviceId === selectedRow.data.deviceId)) {
        settings.selectedRows.push(selectedRow.data);
      }
    } else if (selectedRow.selected !== undefined && !selectedRow.selected) {
      settings.selectedRows = settings.selectedRows.filter((obj) => obj.deviceId !== selectedRow.data.deviceId);
    } else if (selectedRow.length === 0) {
      settings.selectedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.selectedRows,
      settings
    );
  }

  // set excluded rows
  public setSessionSettingsExcludedRows(excludedRow: any) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (!settings.excludedRows) {
      settings.excludedRows = [];
    }

    if (excludedRow.selected !== undefined && excludedRow.selected) {
      if (_.find(settings.excludedRows, (x) => x.deviceId === excludedRow.data.deviceId)) {
        settings.excludedRows = settings.excludedRows.filter((obj) => obj.deviceId !== excludedRow.data.deviceId);
      }
    } else if (excludedRow.selected !== undefined && !excludedRow.selected) {
      if (!_.find(settings.excludedRows, (x) => x.deviceId === excludedRow.data.deviceId)) {
        settings.excludedRows.push(excludedRow.data);
      }
    } else if (excludedRow.length === 0) {
      settings.excludedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.excludedRows,
      settings
    );
  }

  // searched text
  public getSessionSettingsSearchedText() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchText;
  }

  // searched wildcard
  public getSessionSettingsSearchedWildcards() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchWildcards;
  }

  // set searched text
  public setSessionSettingsSearchedText(text: string) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.searchText = text;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.searchString,
      settings
    );
  }

  // page index
  public getSessionSettingsPageIndex() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.pageIndex;
  }

  // set page index
  public setSessionSettingsPageIndex(index: number) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.pageIndex = index;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.pageIndex,
      settings
    );
  }

  saveMyGridLinkRequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridName, requestId);
  }

  removeMyGridLinkRequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridName, requestId);
  }

  saveMyGridLink_BreakerState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridNameBreakerState, requestId);
  }

  saveMyGridLink_CiiState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridNameCiiState, requestId);
  }

  saveMyGridLink_RelaysState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridNameRelaysState, requestId);
  }

  saveCryptoimportId(importId: string) {
    this.gridSettingsSessionStoreService.saveCryptoImportId(importId);
  }

  removeCryptoImportId(importId: string) {
    this.gridSettingsSessionStoreService.removeCryptoImportId(importId);
  }

  getAllCryptoImportIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllCryptoImportIds();
  }
}

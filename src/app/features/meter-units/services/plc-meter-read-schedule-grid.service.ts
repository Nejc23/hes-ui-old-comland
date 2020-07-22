import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { MeterUnitsTypeGridService } from '../types/services/meter-units-type-grid.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterReadScheduleGridService {
  sessionNameForGridFilter = 'grdLayoutDCU';

  constructor(
    private i18n: I18n,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService
  ) {}

  getSelectedRowsOrFilters(): GridBulkActionRequestParams {
    const selectedAll = this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();
    // console.log(`selectedAll = ${JSON.stringify(selectedAll)}`);
    const selectedRows = this.meterUnitsTypeGridService.getSessionSettingsSelectedRows();
    // console.log(`selectedRows = ${JSON.stringify(selectedRows)}`);
    const selectedRowsIDs = _.map(selectedRows, 'deviceId');
    // console.log(`selectedRowsIDs = ${JSON.stringify(selectedRowsIDs)}`);

    const requestModel: GridBulkActionRequestParams = {
      id: selectedRowsIDs,
      filter: {
        statuses: [{ id: 0, value: '' }],
        tags: [{ id: 0, value: '' }],
        vendor: { id: 0, value: '' },
        readStatus: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: null
        },
        firmware: [{ id: 0, value: '' }],
        breakerState: [{ id: 0, value: '' }],
        showChildInfoMBus: false,
        showDeleted: false
      }
    };

    if (selectedAll) {
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
      requestModel.filter.statuses = filterDCU.statusesFilter;
      requestModel.filter.vendor = filterDCU.vendorFilter;
      requestModel.filter.tags = filterDCU.tagsFilter;
      if (filterDCU.readStatusFilter !== undefined && filterDCU.readStatusFilter != null) {
        requestModel.filter.readStatus.operation = filterDCU.readStatusFilter.operation;
        requestModel.filter.readStatus.value1 = filterDCU.readStatusFilter.value1;
        requestModel.filter.readStatus.value2 = filterDCU.readStatusFilter.value2;
      } else {
        requestModel.filter.readStatus = {
          operation: { id: '', value: '' },
          value1: 0,
          value2: 0
        };
      }
      requestModel.filter.firmware = filterDCU.firmwareFilter;
      requestModel.filter.breakerState = filterDCU.breakerStateFilter;
      requestModel.filter.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
      requestModel.filter.showDeleted = filterDCU.showDeletedMeterUnitsFilter;
      requestModel.filter.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
    }

    return requestModel;
  }
}

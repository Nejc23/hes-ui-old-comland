import { AgGridModule } from '@ag-grid-community/angular';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeterUnitDetailsComponent } from '../../details/components/meter-unit-details.component';
import { RegistersChartComponent } from '../../registers/components/chart/registers-chart.component';
import { RegistersColumnChartComponent } from '../../registers/components/chart/registers-column-chart.component';
import { RegistersStatisticsComponent } from '../../registers/components/statistics/registers-statistics.component';
import { ActionFormComponent } from '../../types/components/action-form/components/action-form.component';
import { MeterUnitFilterComponent } from '../../types/components/filter-form/meter-unit-filter.component';
import { GridCellActionsComponent } from '../../types/components/grid-custom-components/grid-cell-actions.component';
import { GridCellBreakerStateComponent } from '../../types/components/grid-custom-components/grid-cell-breaker-state.component';
import { GridCellCiiStateComponent } from '../../types/components/grid-custom-components/grid-cell-cii-state.component';
import { GridCellDetailLinkComponent } from '../../types/components/grid-custom-components/grid-cell-detail-link.component';
import { GridCellFirmwareComponent } from '../../types/components/grid-custom-components/grid-cell-firmware.component';
import { GridCellIconComponent } from '../../types/components/grid-custom-components/grid-cell-icon.component';
import { GridCellIdNumberComponent } from '../../types/components/grid-custom-components/grid-cell-id-number.component';
import { GridCellInfoOfChildComponent } from '../../types/components/grid-custom-components/grid-cell-info-of-child.component';
import { GridCellJobStatusComponent } from '../../types/components/grid-custom-components/grid-cell-job-status.component';
import { GridCellMeterIdComponent } from '../../types/components/grid-custom-components/grid-cell-meter-id.component';
import { GridCellModuleIdComponent } from '../../types/components/grid-custom-components/grid-cell-module-id.component';
import { GridCellParentComponent } from '../../types/components/grid-custom-components/grid-cell-parent.component';
import { GridCellReadStatusComponent } from '../../types/components/grid-custom-components/grid-cell-read-status.component';
import { GridCellStatusComponent } from '../../types/components/grid-custom-components/grid-cell-status.component';
import { GridCellTagsComponent } from '../../types/components/grid-custom-components/grid-cell-tags.component';
import { GridCellVendorComponent } from '../../types/components/grid-custom-components/grid-cell-vendor.component';
import { GridCellTimeOfUseIdComponent } from '../../types/components/grid-custom-components/grid-cell-time-of-use-id.component';
import { GridCellThresholdComponent } from '../../types/components/grid-custom-components/grid-cell-threshold.component';
import { GridCellUnitComponent } from '../../registers/components/grid/grid-custom-components/grid-cell-unit.component';
import { MeterUnitsListComponent } from '../../types/components/meter-units-list.component';
import { GridSelectionHeaderComponent } from '../../types/components/grid-custom-components/grid-selection-header.component';
import { MeterUnitRegistersComponent } from '../../registers/components/meter-unit-registers.component';
import { RegistersPieChartComponent } from '../../registers/components/chart/registers-pie-chart.component';
import { RegistersGridComponent } from '../../registers/components/grid/registers-grid.component';
import { GridCellDateComponent } from '../../registers/components/grid/grid-custom-components/grid-cell-date.component';
import { GridCellProtocolComponent } from '../../types/components/grid-custom-components/grid-cell-protocol.component';
import { GridCellMediumComponent } from '../../types/components/grid-custom-components/grid-cell-medium.component';
import { AddMeterUnitFormComponent } from '../components/add-mu-form/add-meter-unit-form.component';
import { GridCellInstantValuesComponent } from '../../types/components/grid-custom-components/grid-cell-instant-values.component';
import { MeterUnitsRoutingModule } from './meter-units-routing.module';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { EditMeterUnitFormComponent } from '../components/edit-mu-form/edit-meter-unit-form.component';
import { ErrorMessageModalComponent } from '../components/import-devices/error-messages-modal/error-message-modal.component';
import { TouConfigurationImportComponent } from '../components/plc-meter-tou-config-import/tou-configuration-import.component';

@NgModule({
  entryComponents: [],
  declarations: [
    MeterUnitsListComponent,
    // AllForJobComponent,
    ActionFormComponent,
    GridSelectionHeaderComponent,
    GridCellStatusComponent,
    GridCellReadStatusComponent,
    GridCellMeterIdComponent,
    GridCellTagsComponent,
    GridCellParentComponent,
    GridCellVendorComponent,
    GridCellModuleIdComponent,
    GridCellFirmwareComponent,
    GridCellIdNumberComponent,
    GridCellTimeOfUseIdComponent,
    GridCellBreakerStateComponent,
    GridCellCiiStateComponent,
    GridCellInfoOfChildComponent,
    GridCellIconComponent,
    GridCellJobStatusComponent,
    GridCellActionsComponent,
    MeterUnitFilterComponent,
    MeterUnitRegistersComponent,
    RegistersChartComponent,
    RegistersPieChartComponent,
    RegistersColumnChartComponent,
    RegistersGridComponent,
    RegistersStatisticsComponent,
    GridCellDateComponent,
    GridCellDetailLinkComponent,
    MeterUnitDetailsComponent,
    GridCellProtocolComponent,
    GridCellMediumComponent,
    AddMeterUnitFormComponent,
    GridCellInstantValuesComponent,
    GridCellThresholdComponent,
    GridCellUnitComponent,
    EditMeterUnitFormComponent,
    ErrorMessageModalComponent,
    TouConfigurationImportComponent
  ],
  exports: [RegistersColumnChartComponent],
  imports: [
    SharedModule,
    MeterUnitsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([
      GridSelectionHeaderComponent,
      GridCellStatusComponent,
      GridCellReadStatusComponent,
      GridCellMeterIdComponent,
      GridCellTagsComponent,
      GridCellParentComponent,
      GridCellVendorComponent,
      GridCellModuleIdComponent,
      GridCellFirmwareComponent,
      GridCellIdNumberComponent,
      GridCellTimeOfUseIdComponent,
      GridCellBreakerStateComponent,
      GridCellCiiStateComponent,
      GridCellInfoOfChildComponent,
      GridCellIconComponent,
      GridCellJobStatusComponent,
      GridCellActionsComponent,
      PipesModule,
      GridCellDateComponent,
      GridCellDetailLinkComponent,
      GridCellProtocolComponent,
      GridCellThresholdComponent,
      GridCellMediumComponent,
      GridCellInstantValuesComponent,
      GridCellUnitComponent
    ])
  ]
})
export class MeterUnitsModule {}

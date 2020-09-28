import { GridCellDateComponent } from './../../registers/components/grid/grid-custom-components/grid-cell-date.component';
import { PipesModule } from './../../../../shared/pipes/pipes.module';
import { environment } from 'src/environments/environment';
import { RegistersGridComponent } from './../../registers/components/grid/registers-grid.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { MeterUnitRegistersComponent } from './../../registers/components/meter-unit-registers.component';
import { MeterUnitDetailsComponent } from '../../details/components/meter-unit-details.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { MeterUnitsRoutingModule } from './meter-units-routing.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { MeterUnitsOverviewComponent } from '../../overview/components/meter-units-overview.component';
import { MeterUnitsTypeComponent } from '../../types/components/meter-units-type.component';
import { ActionFormComponent } from '../../types/components/action-form/components/action-form.component';
import { GridSelectionHeaderComponent } from '../../types/components/grid-custom-components/grid-selection-header.component';
import { GridCellIdNumberComponent } from '../../types/components/grid-custom-components/grid-cell-id-number.component';
import { GridCellStatusComponent } from '../../types/components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../../types/components/grid-custom-components/grid-cell-read-status.component';
import { GridCellTagsComponent } from '../../types/components/grid-custom-components/grid-cell-tags.component';
import { GridCellVendorComponent } from '../../types/components/grid-custom-components/grid-cell-vendor.component';
import { GridCellParentComponent } from '../../types/components/grid-custom-components/grid-cell-parent.component';
import { GridCellModuleIdComponent } from '../../types/components/grid-custom-components/grid-cell-module-id.component';
import { GridCellMeterIdComponent } from '../../types/components/grid-custom-components/grid-cell-meter-id.component';
import { GridCellFirmwareComponent } from '../../types/components/grid-custom-components/grid-cell-firmware.component';
import { GridCellTimeOfUseIdComponent } from '../../types/components/grid-custom-components/grid-cell-time-of-use-id.component';
import { GridCellBreakerStateComponent } from '../../types/components/grid-custom-components/grid-cell-breaker-state.component';
import { GridCellInfoOfChildComponent } from '../../types/components/grid-custom-components/grid-cell-info-of-child.component';
import { GridCellIconComponent } from '../../types/components/grid-custom-components/grid-cell-icon.component';
import { GridCellJobStatusComponent } from '../../types/components/grid-custom-components/grid-cell-job-status.component';
import { MeterUnitFilterComponent } from '../../types/components/filter-form/meter-unit-filter.component';
import { GridCellActionsComponent } from '../../types/components/grid-custom-components/grid-cell-actions.component';
import { RegistersChartComponent } from '../../registers/components/chart/registers-chart.component';
import { RegistersStatisticsComponent } from '../../registers/components/statistics/registers-statistics.component';
import { GridCellDetailLinkComponent } from '../../types/components/grid-custom-components/grid-cell-detail-link.component';

@NgModule({
  entryComponents: [],
  declarations: [
    MeterUnitsOverviewComponent,
    MeterUnitsTypeComponent,
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
    GridCellInfoOfChildComponent,
    GridCellIconComponent,
    GridCellJobStatusComponent,
    GridCellActionsComponent,
    MeterUnitFilterComponent,
    MeterUnitRegistersComponent,
    RegistersChartComponent,
    RegistersGridComponent,
    RegistersStatisticsComponent,
    GridCellDateComponent,
    GridCellDetailLinkComponent,
    MeterUnitDetailsComponent
  ],
  imports: [
    SharedModule,
    MeterUnitsRoutingModule,
    BreadcrumbsModule,
    ChartsModule,
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
      GridCellInfoOfChildComponent,
      GridCellIconComponent,
      GridCellJobStatusComponent,
      GridCellActionsComponent,
      PipesModule,
      GridCellDateComponent,
      GridCellDetailLinkComponent
    ])
  ]
})
export class MeterUnitsModule {}

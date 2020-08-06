import { AllForJobGridCustomFilterComponent } from './../../all-for-job/components/grid-custom-components/grid-custom-filter.component';
import { AllForJobGridSelectionHeaderComponent } from './../../all-for-job/components/grid-custom-components/grid-selection-header.component';
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
import { GridCellNameComponent } from '../../types/components/grid-custom-components/grid-cell-name.component';
import { GridCellTagsComponent } from '../../types/components/grid-custom-components/grid-cell-tags.component';
import { GridCustomFilterComponent } from '../../types/components/grid-custom-components/grid-custom-filter.component';
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
import { AllForJobComponent } from '../../all-for-job/components/all-for-job.component';
import { AllForJobGridCellNameComponent } from '../../all-for-job/components/grid-custom-components/grid-cell-name.component';
import { AllForJobGridCellVendorComponent } from '../../all-for-job/components/grid-custom-components/grid-cell-vendor.component';
import { AllForJobGridCellIdNumberComponent } from '../../all-for-job/components/grid-custom-components/grid-cell-id-number.component';

@NgModule({
  entryComponents: [],
  declarations: [
    MeterUnitsOverviewComponent,
    MeterUnitsTypeComponent,
    AllForJobComponent,
    ActionFormComponent,
    GridSelectionHeaderComponent,
    GridCellStatusComponent,
    GridCellReadStatusComponent,
    GridCellNameComponent,
    GridCellMeterIdComponent,
    GridCellTagsComponent,
    GridCustomFilterComponent,
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
    AllForJobGridSelectionHeaderComponent,
    AllForJobGridCellNameComponent,
    AllForJobGridCellVendorComponent,
    AllForJobGridCellIdNumberComponent,
    AllForJobGridCustomFilterComponent
  ],
  imports: [
    SharedModule,
    MeterUnitsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([
      GridSelectionHeaderComponent,
      GridCellStatusComponent,
      GridCellReadStatusComponent,
      GridCellNameComponent,
      GridCellMeterIdComponent,
      GridCellTagsComponent,
      GridCustomFilterComponent,
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
      AllForJobGridSelectionHeaderComponent,
      AllForJobGridCellNameComponent,
      AllForJobGridCellVendorComponent,
      AllForJobGridCellIdNumberComponent,
      AllForJobGridCustomFilterComponent
    ])
  ]
})
export class MeterUnitsModule {}

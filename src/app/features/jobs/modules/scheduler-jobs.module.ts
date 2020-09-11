import { DcuForJobGridCellTypeComponent } from './../dcu-for-job/components/grid-custom-components/grid-cell-type.component';
import { DcuForJobGridCellVendorComponent } from './../dcu-for-job/components/grid-custom-components/grid-cell-vendor.component';
import { DcuForJobGridCellNameComponent } from './../dcu-for-job/components/grid-custom-components/grid-cell-name.component';
import { DcuForJobGridCellIdNumberComponent } from './../dcu-for-job/components/grid-custom-components/grid-cell-id-number.component';
import { DcuForJobComponent } from './../dcu-for-job/components/dcu-for-job.component';
import { AllForJobComponent } from '../meter-units-for-job/components/meter-units-for-job.component';
import { GridCellDeviceCountComponent } from './../components/grid-custom-components/grid-cell-device-count.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SchedulerJobsListComponent } from '../components/scheduler-jobs-list/scheduler-jobs-list.component';
import { SchedulerJobsRoutingModule } from './scheduler-jobs-routing.module';
import { GridCellActiveComponent } from '../components/grid-custom-components/grid-cell-active.component';
import { ActionFormComponent } from '../components/action-form/components/action-form.component';
import { GridCellNextRunComponent } from '../components/grid-custom-components/grid-cell-next-run.component';
import { GridCellEditActionsComponent } from '../components/grid-custom-components/grid-cell-edit-actions.component';
import { AllForJobGridCellNameComponent } from '../meter-units-for-job/components/grid-custom-components/grid-cell-name.component';
import { AllForJobGridCellIdNumberComponent } from '../meter-units-for-job/components/grid-custom-components/grid-cell-id-number.component';
import { AllForJobGridCellVendorComponent } from '../meter-units-for-job/components/grid-custom-components/grid-cell-vendor.component';
import { AllForJobGridCustomFilterComponent } from '../meter-units-for-job/components/grid-custom-components/grid-custom-filter.component';
import { AllForJobGridSelectionHeaderComponent } from '../meter-units-for-job/components/grid-custom-components/grid-selection-header.component';
import { DcuForJobGridSelectionHeaderComponent } from '../dcu-for-job/components/grid-custom-components/grid-selection-header.component';

@NgModule({
  entryComponents: [],
  declarations: [
    SchedulerJobsListComponent,
    GridCellActiveComponent,
    GridCellNextRunComponent,
    GridCellEditActionsComponent,
    GridCellDeviceCountComponent,
    ActionFormComponent,
    AllForJobGridCellNameComponent,
    AllForJobGridCellVendorComponent,
    AllForJobGridCellIdNumberComponent,
    AllForJobGridCustomFilterComponent,
    AllForJobComponent,
    AllForJobGridSelectionHeaderComponent,
    DcuForJobComponent,
    DcuForJobGridCellIdNumberComponent,
    DcuForJobGridCellNameComponent,
    DcuForJobGridCellVendorComponent,
    DcuForJobGridSelectionHeaderComponent,
    DcuForJobGridCellTypeComponent
  ],
  imports: [
    SharedModule,
    SchedulerJobsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([
      GridCellActiveComponent,
      GridCellNextRunComponent,
      GridCellEditActionsComponent,
      GridCellDeviceCountComponent,
      AllForJobGridSelectionHeaderComponent,
      AllForJobGridCellNameComponent,
      AllForJobGridCellVendorComponent,
      AllForJobGridCellIdNumberComponent,
      AllForJobGridCustomFilterComponent,
      DcuForJobGridCellIdNumberComponent,
      DcuForJobGridCellNameComponent,
      DcuForJobGridCellVendorComponent,
      DcuForJobGridSelectionHeaderComponent,
      DcuForJobGridCellTypeComponent
    ])
  ],
  exports: []
})
export class SchedulerJobsModule {}

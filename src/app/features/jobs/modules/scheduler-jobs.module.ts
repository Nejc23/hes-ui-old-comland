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
import { GridCellDeleteComponent } from '../components/grid-custom-components/grid-cell-delete-btn.component';
import { GridCellEditComponent } from '../components/grid-custom-components/grid-cell-edit-btn.component';
import { AllForJobGridCellNameComponent } from '../meter-units-for-job/components/grid-custom-components/grid-cell-name.component';
import { AllForJobGridCellIdNumberComponent } from '../meter-units-for-job/components/grid-custom-components/grid-cell-id-number.component';
import { AllForJobGridCellVendorComponent } from '../meter-units-for-job/components/grid-custom-components/grid-cell-vendor.component';
import { AllForJobGridCustomFilterComponent } from '../meter-units-for-job/components/grid-custom-components/grid-custom-filter.component';
import { AllForJobGridSelectionHeaderComponent } from '../meter-units-for-job/components/grid-custom-components/grid-selection-header.component';

@NgModule({
  entryComponents: [],
  declarations: [
    SchedulerJobsListComponent,
    GridCellActiveComponent,
    GridCellNextRunComponent,
    GridCellDeleteComponent,
    GridCellEditComponent,
    GridCellDeviceCountComponent,
    ActionFormComponent,
    AllForJobGridCellNameComponent,
    AllForJobGridCellVendorComponent,
    AllForJobGridCellIdNumberComponent,
    AllForJobGridCustomFilterComponent,
    AllForJobComponent,
    AllForJobGridSelectionHeaderComponent
  ],
  imports: [
    SharedModule,
    SchedulerJobsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([
      GridCellActiveComponent,
      GridCellNextRunComponent,
      GridCellDeleteComponent,
      GridCellEditComponent,
      GridCellDeviceCountComponent,
      AllForJobGridSelectionHeaderComponent,
      AllForJobGridCellNameComponent,
      AllForJobGridCellVendorComponent,
      AllForJobGridCellIdNumberComponent,
      AllForJobGridCustomFilterComponent
    ])
  ],
  exports: []
})
export class SchedulerJobsModule {}

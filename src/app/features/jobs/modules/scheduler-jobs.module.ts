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

@NgModule({
  entryComponents: [],
  declarations: [
    SchedulerJobsListComponent,
    GridCellActiveComponent,
    GridCellNextRunComponent,
    GridCellDeleteComponent,
    GridCellEditComponent,
    GridCellDeviceCountComponent,
    ActionFormComponent
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
      GridCellDeviceCountComponent
    ])
  ],
  exports: []
})
export class SchedulerJobsModule {}

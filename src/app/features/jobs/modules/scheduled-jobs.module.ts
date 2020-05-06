import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ScheduledJobsListComponent } from '../components/scheduled-jobs-list/scheduled-jobs-list.component';
import { ScheduledJobsRoutingModule } from './scheduled-jobs-routing.module';
import { GridCellActiveComponent } from '../components/grid-custom-components/grid-cell-active.component';
import { ActionFormComponent } from '../components/action-form/components/action-form.component';

@NgModule({
  entryComponents: [],
  declarations: [ScheduledJobsListComponent, GridCellActiveComponent, ActionFormComponent],
  imports: [SharedModule, ScheduledJobsRoutingModule, BreadcrumbsModule, AgGridModule.withComponents([GridCellActiveComponent])],
  exports: []
})
export class ScheduledJobsModule {}

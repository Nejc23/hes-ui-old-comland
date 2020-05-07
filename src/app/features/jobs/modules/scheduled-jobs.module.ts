import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ScheduledJobsListComponent } from '../components/scheduled-jobs-list/scheduled-jobs-list.component';
import { ScheduledJobsRoutingModule } from './scheduled-jobs-routing.module';
import { GridCellActiveComponent } from '../components/grid-custom-components/grid-cell-active.component';
import { ActionFormComponent } from '../components/action-form/components/action-form.component';
import { GridCellNextRunComponent } from '../components/grid-custom-components/grid-cell-next-run.component';
import { GridCellTextWithDeleteComponent } from '../components/grid-custom-components/grid-cell-text-with-delete-btn.component';

@NgModule({
  entryComponents: [],
  declarations: [
    ScheduledJobsListComponent,
    GridCellActiveComponent,
    GridCellNextRunComponent,
    GridCellTextWithDeleteComponent,
    ActionFormComponent
  ],
  imports: [
    SharedModule,
    ScheduledJobsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([GridCellActiveComponent, GridCellNextRunComponent, GridCellTextWithDeleteComponent])
  ],
  exports: []
})
export class ScheduledJobsModule {}

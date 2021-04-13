import { AllForJobComponent } from '../meter-units-for-job/components/meter-units-for-job.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SchedulerJobsListComponent } from '../components/scheduler-jobs-list/scheduler-jobs-list.component';
import { DcuForJobComponent } from '../dcu-for-job/components/dcu-for-job.component';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: $localize`Jobs`,
      permission: PermissionEnumerator.View_Jobs
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: SchedulerJobsListComponent
      },
      {
        path: 'meter-units/:scheduleId',
        data: {
          breadcrumb: $localize`Meter Units`
        },
        component: AllForJobComponent
      },
      {
        path: 'concentrators/:scheduleId',
        data: {
          breadcrumb: $localize`Concentrator Units`
        },
        component: DcuForJobComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerJobsRoutingModule {
  constructor() {
    routes.forEach((x) => {
      x.data.breadcrumb = $localize`${x.data.breadcrumb}`;
    });
  }
}

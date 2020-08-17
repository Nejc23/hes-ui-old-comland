import { AllForJobComponent } from '../meter-units-for-job/components/meter-units-for-job.component';
import { Routes, RouterModule } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { NgModule } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { SchedulerJobsListComponent } from '../components/scheduler-jobs-list/scheduler-jobs-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Overview - Jobs',
      permission: FunctionalityEnumerator.jobs
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
        path: ':scheduleId',
        data: {
          breadcrumb: 'Meter Units'
        },
        component: AllForJobComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerJobsRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => {
      x.data.breadcrumb = i18n(x.data.breadcrumb);
    });
  }
}

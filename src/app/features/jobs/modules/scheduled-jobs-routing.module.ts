import { Routes, RouterModule } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { NgModule } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ScheduledJobsListComponent } from '../components/scheduled-jobs-list/scheduled-jobs-list.component';

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
        component: ScheduledJobsListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledJobsRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => {
      x.data.breadcrumb = i18n(x.data.breadcrumb);
    });
  }
}

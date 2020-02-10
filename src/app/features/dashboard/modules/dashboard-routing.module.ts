import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Dashboard',
      permission: FunctionalityEnumerator.dashboard
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: DashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

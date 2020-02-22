import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Overview - Data Concentrator Units',
      permission: FunctionalityEnumerator.dashboard
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: DataConcentratorUnitsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataConcentratorUnitsRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
import { breadcrumbNameDCU } from '../consts/static-text.const';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: breadcrumbNameDCU,
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
export class DdataConcentrratorUnitsRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

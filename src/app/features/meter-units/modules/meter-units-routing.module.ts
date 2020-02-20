import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { MeterUnitsComponent } from '../components/meter-units.component';
import { breadcrumbNameMU } from '../consts/static-text.const';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: breadcrumbNameMU,
      permission: FunctionalityEnumerator.dashboard
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: MeterUnitsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeterUnitsRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

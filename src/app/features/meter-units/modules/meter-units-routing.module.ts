import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { breadcrumbNameMU, breadcrumbNameMUOverview } from '../consts/static-text.const';
import { MeterUnitsOverviewComponent } from '../overview/components/meter-units-overview.component';
import { MeterUnitsTypeComponent } from '../types/components/meter-units-type.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: '',
      permission: FunctionalityEnumerator.dashboard
    },
    children: [
      {
        path: 'overview',
        data: {
          breadcrumb: breadcrumbNameMU + ' - ' + breadcrumbNameMUOverview
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: null
            },
            component: MeterUnitsOverviewComponent
          }
        ]
      },
      {
        path: ':id',
        data: {
          breadcrumb: null
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: null
            },
            component: MeterUnitsTypeComponent
          }
        ]
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

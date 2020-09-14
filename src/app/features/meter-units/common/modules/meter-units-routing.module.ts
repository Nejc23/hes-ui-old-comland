import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { MeterUnitsOverviewComponent } from '../../overview/components/meter-units-overview.component';
import { MeterUnitsTypeComponent } from '../../types/components/meter-units-type.component';
import { MeterUnitDetailComponent } from '../../detail/components/meter-unit-detail.component';
// import { AllForJobComponent } from '../../all-for-job/components/all-for-job.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Meter Units',
      permission: FunctionalityEnumerator.MU
    },
    children: [
      {
        path: 'overview',
        data: {
          breadcrumb: 'Overview - Meter Units'
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
        path: 'detail/:deviceId',
        data: {
          breadcrumb: null
        },
        component: MeterUnitDetailComponent
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
    routes.map(x => {
      x.children !== undefined
        ? x.children.map(y => {
            y.children !== undefined
              ? y.children.map(z =>
                  z.data.breadcrumb !== null ? (z.data.breadcrumb = i18n(z.data.breadcrumb)) : (z.data.breadcrumb = null)
                )
              : (y = y);
            y.data.breadcrumb !== null ? (y.data.breadcrumb = i18n(y.data.breadcrumb)) : (y.data.breadcrumb = null);
          })
        : (x = x);
      x.data.breadcrumb = i18n(x.data.breadcrumb);
    });
    // routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

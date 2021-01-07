import { MeterUnitRegistersComponent } from './../../registers/components/meter-unit-registers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { MeterUnitsOverviewComponent } from '../../overview/components/meter-units-overview.component';
import { MeterUnitsTypeComponent } from '../../types/components/meter-units-type.component';
import { MeterUnitDetailsComponent } from '../../details/components/meter-unit-details.component';
// import { AllForJobComponent } from '../../all-for-job/components/all-for-job.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: $localize`Meter Units`,
      permission: FunctionalityEnumerator.MU
    },
    children: [
      {
        path: 'overview',
        data: {
          breadcrumb: $localize`Overview - Meter Units`
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
        path: 'registers/:deviceId',
        data: {
          breadcrumb: null
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: null
            },
            component: MeterUnitRegistersComponent
          }
        ]
      },
      {
        path: 'details/:deviceId',
        data: {
          breadcrumb: $localize`Meter Unit`
        },
        component: MeterUnitDetailsComponent
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
  constructor() {
    routes.map((x) => {
      x.children !== undefined
        ? x.children.map((y) => {
            y.children !== undefined
              ? y.children.map((z) =>
                  z.data.breadcrumb !== null ? (z.data.breadcrumb = $localize`${z.data.breadcrumb}`) : (z.data.breadcrumb = null)
                )
              : (y = y);
            y.data.breadcrumb !== null ? (y.data.breadcrumb = $localize`${y.data.breadcrumb}`) : (y.data.breadcrumb = null);
          })
        : (x = x);
      x.data.breadcrumb = $localize`${x.data.breadcrumb}`;
    });
    // routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

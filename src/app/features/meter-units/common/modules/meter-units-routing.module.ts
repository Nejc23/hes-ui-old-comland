import { PermissionEnumerator } from './../../../../core/permissions/enumerators/permission-enumerator.model';
import { MeterUnitRegistersComponent } from './../../registers/components/meter-unit-registers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeterUnitsListComponent } from '../../types/components/meter-units-list.component';
import { MeterUnitDetailsComponent } from '../../details/components/meter-unit-details.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'MENU.METER-UNITS',
      permission: PermissionEnumerator.View_Meters
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: MeterUnitsListComponent
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
          breadcrumb: ''
        },
        component: MeterUnitDetailsComponent
      },
      {
        path: ':id',
        data: {
          breadcrumb: null
        },
        redirectTo: ''
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
                  z.data.breadcrumb !== null ? (z.data.breadcrumb = `${z.data.breadcrumb}`) : (z.data.breadcrumb = null)
                )
              : (y = y);
            y.data.breadcrumb !== null ? (y.data.breadcrumb = `${y.data.breadcrumb}`) : (y.data.breadcrumb = null);
          })
        : (x = x);
      x.data.breadcrumb = `${x.data.breadcrumb}`;
    });
    // routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

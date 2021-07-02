import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
import { DataConcentratorDetailComponent } from '../details/components/data-concentrator-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'MENU.DCU',
      permission: PermissionEnumerator.View_Concentrators
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null,
          permission: PermissionEnumerator.View_Concentrators
        },
        component: DataConcentratorUnitsComponent
      },
      {
        path: ':id',
        data: {
          breadcrumb: 'BREADCRUMB.CONCENTRATOR',
          permission: PermissionEnumerator.View_Concentrators
        },
        component: DataConcentratorDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataConcentratorUnitsRoutingModule {
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

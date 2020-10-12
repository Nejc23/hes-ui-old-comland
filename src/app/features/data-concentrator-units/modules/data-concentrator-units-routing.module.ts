import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
import { DataConcentratorDetailComponent } from '../details/components/data-concentrator-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Data Concentrator Units',
      permission: FunctionalityEnumerator.DCU
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null,
          permission: FunctionalityEnumerator.DCU
        },
        component: DataConcentratorUnitsComponent
      },
      {
        path: ':id',
        data: {
          breadcrumb: 'Concentrator',
          permission: FunctionalityEnumerator.DCU
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
    routes.map(x => {
      x.children !== undefined
        ? x.children.map(y => {
            y.children !== undefined
              ? y.children.map(z =>
                  z.data.breadcrumb !== null ? (z.data.breadcrumb = $localize `${z.data.breadcrumb}`) : (z.data.breadcrumb = null)
                )
              : (y = y);
            y.data.breadcrumb !== null ? (y.data.breadcrumb = $localize `${y.data.breadcrumb}`) : (y.data.breadcrumb = null);
          })
        : (x = x);
      x.data.breadcrumb = $localize `${x.data.breadcrumb}`;
    });
    // routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

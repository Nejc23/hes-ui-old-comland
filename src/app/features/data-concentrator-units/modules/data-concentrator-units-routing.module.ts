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

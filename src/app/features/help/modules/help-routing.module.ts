import { Routes, RouterModule } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { HelpComponent } from '../components/help.component';
import { NgModule } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Help'
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: HelpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {
  constructor(private i18n: I18n) {
    routes.forEach(x => {
      x.data.breadcrumb = i18n(x.data.breadcrumb);
    });
  }
}

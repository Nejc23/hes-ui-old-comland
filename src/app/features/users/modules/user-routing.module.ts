import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from '../components/users.component';
import { UserEditComponent } from '../components/user-edit/user-edit.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { I18n } from '@ngx-translate/i18n-polyfill';
const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Users',
      permission: FunctionalityEnumerator.users
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: UsersComponent
      },
      {
        path: 'user/:id',
        data: {
          breadcrumb: 'User'
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: null
            },
            component: UserEditComponent
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
export class UserRoutingModule {
  constructor(private i18n: I18n) {
    const userText = i18n('User'); // for creating  User tranlation
    routes.forEach(x => {
      x.children.forEach(y => (y.data.breadcrumb !== null ? (y.data.breadcrumb = i18n(y.data.breadcrumb)) : (y.data.breadcrumb = null)));
      x.data.breadcrumb = i18n(x.data.breadcrumb);
    });
  }
}

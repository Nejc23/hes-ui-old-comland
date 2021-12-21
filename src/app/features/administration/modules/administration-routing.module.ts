import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PermissionEnumerator } from '../../../core/permissions/enumerators/permission-enumerator.model';
import { VaultAccessComponent } from '../vaultaccess/componentes/vault-access.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'MENU.ADMINISTRATION'
    },
    children: [
      {
        path: 'vaultAccess',
        data: {
          breadcrumb: '',
          permission: PermissionEnumerator.Vault_Access_Grants
        },
        component: VaultAccessComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {
  constructor() {
    routes.forEach((x) => {
      x.data.breadcrumb = `${x.data.breadcrumb}`;
    });
  }
}

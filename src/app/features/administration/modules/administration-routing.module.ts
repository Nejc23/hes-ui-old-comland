import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PermissionEnumerator } from '../../../core/permissions/enumerators/permission-enumerator.model';
import { VaultAccessComponent } from '../vaultaccess/componentes/vault-access.component';
import { AuditLogsComponent } from '../audit-logs/audit-logs.component';

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
      },
      {
        path: 'auditLogs',
        data: {
          breadcrumb: '',
          permission: PermissionEnumerator.View_Audit_Logs
        },
        component: AuditLogsComponent
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

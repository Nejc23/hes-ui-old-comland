import { PermissionEnumerator } from './../../../core/permissions/enumerators/permission-enumerator.model';
import { AutoTemplateComponent } from '../auto-template/components/auto-template.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImportDeviceKeysComponent } from '../components/import-device-keys/import-device-keys.component';
import { PlcMeterTouConfigImportComponent } from '../../meter-units/common/components/plc-meter-tou-config-import/plc-meter-tou-config-import.component';
import { PlcMeterTemplatesImportComponent } from '../../meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'MENU.TOOLS'
    },
    children: [
      {
        path: 'importTemplates',
        data: {
          breadcrumb: 'MENU.IMPORT-TEMPLATES',
          permission: PermissionEnumerator.Import_Templates
        },
        component: PlcMeterTemplatesImportComponent
      },
      {
        path: 'importTouConfiguration',
        data: {
          breadcrumb: 'MENU.IMPORT-TOU-CONFIGURATION',
          permission: PermissionEnumerator.Import_TOU_Configuration
        },
        component: PlcMeterTouConfigImportComponent
      },
      {
        path: 'autoTemplates',
        data: {
          breadcrumb: 'MENU.AUTO-TEMPLATES',
          permission: PermissionEnumerator.Manage_Auto_Template_Rules
        },
        component: AutoTemplateComponent
      },
      {
        path: 'importDeviceKeys',
        data: {
          breadcrumb: 'MENU.IMPORT-DEVICE-KEYS',
          permission: PermissionEnumerator.Import_Device_Keys
        },
        component: ImportDeviceKeysComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
  constructor() {
    routes.forEach((x) => {
      x.data.breadcrumb = `${x.data.breadcrumb}`;
    });
  }
}

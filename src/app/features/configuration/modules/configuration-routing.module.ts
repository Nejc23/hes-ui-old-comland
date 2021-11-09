import { PermissionEnumerator } from './../../../core/permissions/enumerators/permission-enumerator.model';
import { AutoTemplateComponent } from '../auto-template/components/auto-template.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImportDeviceKeysComponent } from '../components/import-device-keys/import-device-keys.component';
import { PlcMeterTouConfigImportComponent } from '../../meter-units/common/components/plc-meter-tou-config-import/plc-meter-tou-config-import.component';
import { PlcMeterTemplatesImportComponent } from '../../meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';
import { ImportDevicesComponent } from '../../meter-units/common/components/import-devices/import-devices.component';

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
          breadcrumb: '',
          permission: PermissionEnumerator.Import_Templates
        },
        component: PlcMeterTemplatesImportComponent
      },
      {
        path: 'importDevices',
        data: {
          breadcrumb: '',
          permission: PermissionEnumerator.Device_Import
        },
        component: ImportDevicesComponent
      },
      {
        path: 'importTouConfiguration',
        data: {
          breadcrumb: '',
          permission: PermissionEnumerator.Import_TOU_Configuration
        },
        component: PlcMeterTouConfigImportComponent
      },
      {
        path: 'autoTemplates',
        data: {
          breadcrumb: '',
          permission: PermissionEnumerator.Manage_Auto_Template_Rules
        },
        component: AutoTemplateComponent
      },
      {
        path: 'importDeviceKeys',
        data: {
          breadcrumb: '',
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

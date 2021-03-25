import { PermissionEnumerator } from './../../../core/permissions/enumerators/permission-enumerator.model';
import { AutoTemplateComponent } from '../auto-template/components/auto-template.component';
import { Routes, RouterModule } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { NgModule } from '@angular/core';
import { ImportDeviceKeysComponent } from '../components/import-device-keys/import-device-keys.component';
import { PlcMeterTouConfigImportComponent } from '../../meter-units/common/components/plc-meter-tou-config-import/plc-meter-tou-config-import.component';
import { PlcMeterTemplatesImportComponent } from '../../meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: $localize`Tools`
    },
    children: [
      {
        path: 'importTemplates',
        data: {
          breadcrumb: $localize`Import templates`,
          permission: PermissionEnumerator.Import_Templates
        },
        component: PlcMeterTemplatesImportComponent
      },
      {
        path: 'importTouConfiguration',
        data: {
          breadcrumb: $localize`Import TOU configuration`,
          permission: PermissionEnumerator.Import_TOU_Configuration
        },
        component: PlcMeterTouConfigImportComponent
      },
      {
        path: 'autoTemplates',
        data: {
          breadcrumb: $localize`Auto template`,
          permission: PermissionEnumerator.Manage_Auto_Template_Rules
        },
        component: AutoTemplateComponent
      },
      {
        path: 'importDeviceKeys',
        data: {
          breadcrumb: $localize`Import device Keys`,
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
      x.data.breadcrumb = $localize`${x.data.breadcrumb}`;
    });
  }
}

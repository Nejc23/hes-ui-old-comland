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
      breadcrumb: 'Configuration',
      permission: FunctionalityEnumerator.MU
    },
    children: [
      {
        path: 'importTemplates',
        data: {
          breadcrumb: 'Import templates'
        },
        component: PlcMeterTemplatesImportComponent
      },
      {
        path: 'importTouConfiguration',
        data: {
          breadcrumb: 'Import TOU configuration'
        },
        component: PlcMeterTouConfigImportComponent
      },
      {
        path: 'autoTemplates',
        data: {
          breadcrumb: 'Auto template'
        },
        component: AutoTemplateComponent
      },
      {
        path: 'importDeviceKeys',
        data: {
          breadcrumb: 'Import device Keys'
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
    routes.forEach(x => {
      x.data.breadcrumb = $localize`${x.data.breadcrumb}`;
    });
  }
}

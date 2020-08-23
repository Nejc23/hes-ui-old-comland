import { AutoTemplateComponent } from '../auto-template/components/auto-template.component';
import { Routes, RouterModule } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { NgModule } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ModalContainerComponent } from 'src/app/shared/modals/components/modal-container.component';
import { ImportDeviceKeysComponent } from '../components/import-device-keys/import-device-keys.component';

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
        component: ModalContainerComponent
      },
      {
        path: 'importTouConfiguration',
        data: {
          breadcrumb: 'Import TOU configuration'
        },
        component: ModalContainerComponent
      },
      {
        path: 'autoTemplate/:templateId',
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
  constructor(private i18n: I18n) {
    routes.forEach(x => {
      x.data.breadcrumb = i18n(x.data.breadcrumb);
    });
  }
}

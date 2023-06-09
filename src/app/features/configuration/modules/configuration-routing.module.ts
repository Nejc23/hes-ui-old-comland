import { PermissionEnumerator } from './../../../core/permissions/enumerators/permission-enumerator.model';
import { AutoTemplateComponent } from '../auto-template/components/auto-template.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImportDeviceKeysComponent } from '../components/import-device-keys/import-device-keys.component';
import { TouConfigurationComponent } from '../../meter-units/common/components/plc-meter-tou-config-import/tou-configuration.component';
import { ImportDevicesComponent } from '../../meter-units/common/components/import-devices/import-devices.component';
import { TouConfigBasicComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-basic/tou-config-basic.component';
import { TouConfigDayComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-day/tou-config-day.component';
import { TouConfigWeekComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-week/tou-config-week.component';
import { TouConfigSeasonComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-season/tou-config-season.component';
import { TouConfigSpecialDaysComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-special-days/tou-config-special-days.component';
import { TouConfigSummaryComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-summary/tou-config-summary.component';
import { TouConfigListComponent } from '../../meter-units/common/components/plc-meter-tou-config/tou-config-list/tou-config-list.component';
import { CanDeactivateGuard } from '../../../shared/guards/can-deactivate.guard';
import { ConfigurationsDetailComponent } from '../configurations-detail/configurations-detail.component';
import { ConfigurationsListComponent } from '../configurations-list/configurations-list.component';
import { ImportMbusConfigurationComponent } from '../../meter-units/common/components/import-mbus-configuration/import-mbus-configuration.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'MENU.TOOLS'
    },
    children: [
      {
        path: 'importMbusConfiguration',
        data: {
          breadcrumb: '',
          permission: PermissionEnumerator.View_MBus_Configuration
        },
        component: ImportMbusConfigurationComponent
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
        component: TouConfigurationComponent,
        children: [
          {
            path: 'list',
            data: {
              breadcrumb: ''
            },
            component: TouConfigListComponent
          }
        ]
      },
      {
        path: 'importTouConfiguration/wizard',
        component: TouConfigurationComponent,
        children: [
          {
            path: 'basic',
            data: {
              breadcrumb: ''
            },
            component: TouConfigBasicComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'day',
            data: {
              breadcrumb: ''
            },
            component: TouConfigDayComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'week',
            data: {
              breadcrumb: ''
            },
            component: TouConfigWeekComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'season',
            data: {
              breadcrumb: ''
            },
            component: TouConfigSeasonComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'special',
            data: {
              breadcrumb: ''
            },
            component: TouConfigSpecialDaysComponent
          },
          {
            path: 'summary',
            data: {
              breadcrumb: ''
            },
            component: TouConfigSummaryComponent
          }
        ]
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
      },
      {
        path: 'list',
        data: {
          breadcrumb: ''
        },
        component: ConfigurationsListComponent
      },
      {
        path: 'details/:templateId',
        data: {
          breadcrumb: ''
        },
        component: ConfigurationsDetailComponent
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

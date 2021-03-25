import { Injectable } from '@angular/core';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';
import { CodelistRepositoryService } from '../../repository/services/codelists/codelist-repository.service';
import { MeterTypeRoute } from 'src/app/shared/base-template/enums/meter-type.enum';
import { ConfigurationRoute } from 'src/app/shared/base-template/enums/configuration.enum';
import { environment } from 'src/environments/environment';
import { PermissionEnumerator } from '../../permissions/enumerators/permission-enumerator.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
  private sidebarMeterUnitsItems: Array<SidebarItem> = [];
  private sidebarConfigurationItems: Array<SidebarItem> = [];
  public headerTitle = '';

  constructor() {
    this.sidebarItems = [
      {
        title: $localize`Data Concentrator Units`,
        routeLink: '/dataConcentratorUnits',
        hasChildren: false,
        icon: 'gps_fixed',
        children: [],
        permission: PermissionEnumerator.View_Concentrators
      },
      {
        title: $localize`Meter Units`,
        routeLink: '/meterUnits', // TODO set back when overview implemented '/meterUnits/overview',
        hasChildren: false,
        icon: 'gps_not_fixed',
        children: [],
        permission: PermissionEnumerator.View_Meters
      },
      {
        title: $localize`Jobs`,
        routeLink: '/schedulerJobs',
        hasChildren: false,
        icon: 'format_list_bulleted',
        children: [],
        permission: PermissionEnumerator.View_Jobs
      },
      {
        title: $localize`Tools`,
        routeLink: '/configuration',
        icon: 'build',
        isIconOutlined: true,
        hasChildren: true,
        children: [
          {
            title: $localize`Import templates`,
            routeLink: `/${ConfigurationRoute.configuration}/importTemplates`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_Templates
          },
          {
            title: $localize`Import TOU configuration`,
            routeLink: `/${ConfigurationRoute.configuration}/importTouConfiguration`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_TOU_Configuration
          },
          {
            title: $localize`Auto templates`,
            routeLink: `/${ConfigurationRoute.configuration}/autoTemplates`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Manage_Auto_Template_Rules
          },
          {
            title: $localize`Import device keys`,
            routeLink: `/${ConfigurationRoute.configuration}/importDeviceKeys`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_Device_Keys
          }
        ]
      },
      {
        title: $localize`Administration`,
        routeLink: 'administration',
        icon: 'verified_user',
        isIconOutlined: true,
        hasChildren: true,
        children: [
          {
            title: $localize`Users`,
            routeLink: environment.sidebarAdministrationUsersUrl,
            openInNewTab: true,
            isRouteAbsolute: true,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Manage_Access_Permissions
          }
        ]
      }
      // TODO uncomment when implemented
      /*
      {
        title: ``,
        routeLink: '',
        hasChildren: false,
        children: [],
        isBorder: true
      },
      {
        title: this.i18n(`TOU Edit`),
        routeLink: '/touEdit',
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`DCU Reading Configuration`),
        routeLink: '/dcuReadingConfiguration',
        hasChildren: false,
        children: []
      }*/
    ];

    this.sidebarMeterUnitsItems = [
      {
        title: $localize`Back to main menu`,
        icon: 'fas fa-arrow-alt-circle-left',
        routeLink: '/dataConcentratorUnits',
        hasChildren: false,
        children: []
      },
      {
        title: ``,
        routeLink: '',
        hasChildren: false,
        children: [],
        isBorder: true
      }
      /*{ /// TODO uncomment when overview implemented
        title: this.i18n(`Overview`),
        routeLink: `/${MeterTypeRoute.meterUnits}/overview`,
        hasChildren: false,
        children: []
      },
      {
        title: ``,
        routeLink: '',
        hasChildren: false,
        children: [],
        isBorder: true
      }*/
    ];

    this.sidebarConfigurationItems = [
      {
        title: $localize`Back to main menu`,
        icon: 'fas fa-arrow-alt-circle-left',
        routeLink: '/dataConcentratorUnits',
        hasChildren: false,
        children: []
      },
      {
        title: ``,
        routeLink: '',
        hasChildren: false,
        children: [],
        isBorder: true
      },
      {
        title: $localize`Import templates`,
        routeLink: `/${ConfigurationRoute.configuration}/importTemplates`,
        hasChildren: false,
        children: []
      },
      {
        title: $localize`Import TOU configuration`,
        routeLink: `/${ConfigurationRoute.configuration}/importTouConfiguration`,
        hasChildren: false,
        children: []
      },
      {
        title: $localize`Auto templates`,
        routeLink: `/${ConfigurationRoute.configuration}/autoTemplates`,
        hasChildren: false,
        children: []
      },
      {
        title: $localize`Import device keys`,
        routeLink: `/${ConfigurationRoute.configuration}/importDeviceKeys`,
        hasChildren: false,
        children: []
      }
    ];
  }

  getSidebarItems() {
    return [...this.sidebarItems];
  }
  /*
  getSidebarMeterUnitsItems() {
    return [...this.sidebarMeterUnitsItems];
  }

  getSidebarConfigurationItems() {
    return [...this.sidebarConfigurationItems];
  }
*/
  getSidebarItemsMobile() {
    return [...this.sidebarItems.filter((x) => x.routeLink === '/dcuReadingConfiguration' || x.routeLink === '/help')];
  }
}

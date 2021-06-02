import { Injectable } from '@angular/core';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';
import { ConfigurationRoute } from 'src/app/shared/base-template/enums/configuration.enum';
import { PermissionEnumerator } from '../../permissions/enumerators/permission-enumerator.model';
import { AppConfigService } from '../../configuration/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
  public headerTitle = '';

  constructor() {
    this.sidebarItems = [
      {
        title: `Data Concentrator Units`,
        routeLink: '/dataConcentratorUnits',
        hasChildren: false,
        icon: 'gps_fixed',
        children: [],
        permission: PermissionEnumerator.View_Concentrators
      },
      {
        title: `Meter Units`,
        routeLink: '/meterUnits',
        hasChildren: false,
        icon: 'gps_not_fixed',
        children: [],
        permission: PermissionEnumerator.View_Meters
      },
      {
        title: `Jobs`,
        routeLink: '/schedulerJobs',
        hasChildren: false,
        icon: 'format_list_bulleted',
        children: [],
        permission: PermissionEnumerator.View_Jobs
      },
      {
        title: `Alarms & Events`,
        routeLink: '/alarmsEvents',
        hasChildren: false,
        icon: 'notifications',
        isIconOutlined: true,
        children: [],
        permission: PermissionEnumerator.View_Alarms
      },
      {
        title: `Tools`,
        routeLink: '/configuration',
        icon: 'build',
        isIconOutlined: true,
        hasChildren: true,
        children: [
          {
            title: `Import templates`,
            routeLink: `/${ConfigurationRoute.configuration}/importTemplates`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_Templates
          },
          {
            title: `Import TOU configuration`,
            routeLink: `/${ConfigurationRoute.configuration}/importTouConfiguration`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_TOU_Configuration
          },
          {
            title: `Auto templates`,
            routeLink: `/${ConfigurationRoute.configuration}/autoTemplates`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Manage_Auto_Template_Rules
          },
          {
            title: `Import device keys`,
            routeLink: `/${ConfigurationRoute.configuration}/importDeviceKeys`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_Device_Keys
          }
        ]
      },
      {
        title: `Administration`,
        routeLink: 'administration',
        icon: 'verified_user',
        isIconOutlined: true,
        hasChildren: true,
        children: [
          {
            title: `Users`,
            routeLink: AppConfigService.settings.identityServer.stsAuthorityWeb,
            openInNewTab: true,
            isRouteAbsolute: true,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Manage_Access_Permissions
          }
        ]
      }
    ];
  }

  getSidebarItems() {
    return [...this.sidebarItems];
  }

  getSidebarItemsMobile() {
    return [...this.sidebarItems.filter((x) => x.routeLink === '/dcuReadingConfiguration' || x.routeLink === '/help')];
  }
}

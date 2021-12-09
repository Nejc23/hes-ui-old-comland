import { Injectable } from '@angular/core';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';
import { ConfigurationRoute } from 'src/app/shared/base-template/enums/configuration.enum';
import { PermissionEnumerator } from '../../permissions/enumerators/permission-enumerator.model';
import { AppConfigService } from '../../configuration/services/app-config.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public headerTitle = '';
  private sidebarItems: Array<SidebarItem> = [];

  constructor(private translate: TranslateService) {
    this.sidebarItems = [
      {
        title: this.translate.instant('MENU.DCU'),
        routeLink: '/dataConcentratorUnits',
        hasChildren: false,
        icon: 'gps_fixed',
        children: [],
        permission: PermissionEnumerator.View_Concentrators
      },
      {
        title: this.translate.instant('MENU.METER-UNITS'),
        routeLink: '/meterUnits',
        hasChildren: false,
        icon: 'gps_not_fixed',
        children: [],
        permission: PermissionEnumerator.View_Meters
      },
      {
        title: this.translate.instant('MENU.JOBS'),
        routeLink: '/schedulerJobs',
        hasChildren: false,
        icon: 'format_list_bulleted',
        children: [],
        permission: PermissionEnumerator.View_Jobs
      },
      {
        title: this.translate.instant('MENU.ALARMS-EVENTS'),
        routeLink: '/alarmsEvents',
        hasChildren: false,
        icon: 'notifications',
        isIconOutlined: true,
        children: [],
        permission: PermissionEnumerator.View_Alarms
      },
      {
        title: this.translate.instant('MENU.TOOLS'),
        routeLink: '/configuration',
        icon: 'build',
        isIconOutlined: true,
        hasChildren: true,
        children: [
          {
            title: this.translate.instant('MENU.IMPORT-TEMPLATES'),
            routeLink: `/${ConfigurationRoute.configuration}/importTemplates`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_Templates
          },
          {
            title: this.translate.instant('MENU.TOU-CONFIGURATION'),
            routeLink: `/${ConfigurationRoute.configuration}/importTouConfiguration/list`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_TOU_Configuration
          },
          {
            title: this.translate.instant('MENU.AUTO-TEMPLATES'),
            routeLink: `/${ConfigurationRoute.configuration}/autoTemplates`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Manage_Auto_Template_Rules
          },
          {
            title: this.translate.instant('MENU.IMPORT-DEVICES'),
            routeLink: `/${ConfigurationRoute.configuration}/importDevices`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Device_Import
          },
          {
            title: this.translate.instant('MENU.IMPORT-DEVICE-KEYS'),
            routeLink: `/${ConfigurationRoute.configuration}/importDeviceKeys`,
            hasChildren: false,
            children: [],
            permission: PermissionEnumerator.Import_Device_Keys
          }
        ]
      },
      {
        title: this.translate.instant('MENU.ADMINISTRATION'),
        routeLink: 'administration',
        icon: 'verified_user',
        isIconOutlined: true,
        hasChildren: true,
        children: [
          {
            title: this.translate.instant('MENU.USERS'),
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

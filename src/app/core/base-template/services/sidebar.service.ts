import { Injectable } from '@angular/core';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';
import { ConfigurationRoute } from 'src/app/shared/base-template/enums/configuration.enum';
import { PermissionEnumerator } from '../../permissions/enumerators/permission-enumerator.model';
import { AppConfigStoreService } from '../../configuration/services/app-config-store.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
  private stsAuthorityUsers: string;
  public headerTitle = '';

  constructor(private configStoreService: AppConfigStoreService) {
    this.configStoreService.configObservable.subscribe((appConfig) => {
      this.stsAuthorityUsers = appConfig.identityServer.stsAuthorityWeb;
    });

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
        routeLink: '/meterUnits',
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
        title: $localize`Alarms & Events`,
        routeLink: '/alarmsEvents',
        hasChildren: false,
        icon: 'notifications',
        isIconOutlined: true,
        children: [],
        permission: PermissionEnumerator.View_Alarms
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
            routeLink: this.stsAuthorityUsers,
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

import { Injectable } from '@angular/core';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { CodelistRepositoryService } from '../../repository/services/codelists/codelist-repository.service';
import { MeterTypeRoute } from 'src/app/shared/base-template/enums/meter-type.enum';
import { ConfigurationRoute } from 'src/app/shared/base-template/enums/configuration.enum';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
  private sidebarMeterUnitsItems: Array<SidebarItem> = [];
  private sidebarConfigurationItems: Array<SidebarItem> = [];
  public headerTitle = '';

  constructor(private i18n: I18n) {
    this.sidebarItems = [
      {
        title: this.i18n(`Data Concentrator Units`),
        routeLink: '/dataConcentratorUnits',
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Meter Units`),
        routeLink: '/meterUnits/1', // TODO set back when overview implemented '/meterUnits/overview',
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Jobs`),
        routeLink: '/schedulerJobs',
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Configuration`),
        routeLink: '/configuration',
        hasChildren: true,
        children: [
          {
            title: this.i18n(`Import templates`),
            routeLink: `/${ConfigurationRoute.configuration}/importTemplates`,
            hasChildren: false,
            children: []
          },
          {
            title: this.i18n(`Import TOU configuration`),
            routeLink: `/${ConfigurationRoute.configuration}/importTouConfiguration`,
            hasChildren: false,
            children: []
          },
          {
            title: this.i18n(`Auto templates`),
            routeLink: `/${ConfigurationRoute.configuration}/autoTemplates`,
            hasChildren: false,
            children: []
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
        title: this.i18n(`Back to main menu`),
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
        title: this.i18n(`Back to main menu`),
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
        title: this.i18n(`Import templates`),
        routeLink: `/${ConfigurationRoute.configuration}/importTemplates`,
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Import TOU configuration`),
        routeLink: `/${ConfigurationRoute.configuration}/importTouConfiguration`,
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Auto templates`),
        routeLink: `/${ConfigurationRoute.configuration}/autoTemplates`,
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
    return [...this.sidebarItems.filter(x => x.routeLink === '/dcuReadingConfiguration' || x.routeLink === '/help')];
  }
}

import { Injectable } from '@angular/core';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
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
        routeLink: '/meterUnits',
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
      },
      {
        title: this.i18n(`Sample Devextreme`),
        routeLink: '/devextreme',
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Sample KendoUI`),
        routeLink: '/kendo',
        hasChildren: false,
        children: []
      },
      {
        title: this.i18n(`Dashboard`),
        routeLink: '/dashboard',
        hasChildren: false,
        permission: FunctionalityEnumerator.dashboard,
        children: []
      } /*
,      {
        title: this.i18n(`Users`),
        routeLink: '/users',
        hasChildren: false,
        permission: FunctionalityEnumerator.users,
        children: []
      },
      {
        title: this.i18n(`Help`),
        routeLink: '/help',
        hasChildren: false,
        children: []
      }     */
    ];
  }

  getSidebarItems() {
    return [...this.sidebarItems];
  }

  getSidebarItemsMobile() {
    return [...this.sidebarItems.filter(x => x.routeLink === '/dashboard' || x.routeLink === '/help')];
  }
}

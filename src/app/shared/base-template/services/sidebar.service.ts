import { Injectable } from '@angular/core';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
  public headerTitle = '';

  constructor(private i18n: I18n) {
    this.sidebarItems = [
      {
        title: this.i18n('Dashboard'),
        routeLink: '/dashboard',
        icon: 'fas fa-grip-horizontal',
        hasChildren: false,
        permission: FunctionalityEnumerator.dashboard,
        children: []
      },
      {
        title: this.i18n('Users'),
        routeLink: '/users',
        icon: 'fas fa-users',
        hasChildren: false,
        permission: FunctionalityEnumerator.users,
        children: []
      },
      {
        title: this.i18n('Help'),
        routeLink: '/help',
        icon: 'fas fa-question',
        hasChildren: false,
        children: []
      }
    ];
  }

  getSidebarItems() {
    return [...this.sidebarItems];
  }

  getSidebarItemsMobile() {
    return [...this.sidebarItems.filter(x => x.routeLink === '/dashboard' || x.routeLink === '/help')];
  }
}

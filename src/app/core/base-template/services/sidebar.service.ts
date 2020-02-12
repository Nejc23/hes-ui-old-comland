import { Injectable } from '@angular/core';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';
import { SidebarItem } from 'src/app/shared/base-template/interfaces/sidebar-item.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarItems: Array<SidebarItem> = [];
  public headerTitle = '';

  constructor() {
    this.sidebarItems = [
      {
        title: $localize`Dashboard`,
        routeLink: '/dashboard',
        icon: 'fas fa-grip-horizontal',
        hasChildren: false,
        permission: FunctionalityEnumerator.dashboard,
        children: []
      },
      {
        title: $localize`Users`,
        routeLink: '/users',
        icon: 'fas fa-users',
        hasChildren: false,
        permission: FunctionalityEnumerator.users,
        children: []
      },
      {
        title: $localize`Help`,
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

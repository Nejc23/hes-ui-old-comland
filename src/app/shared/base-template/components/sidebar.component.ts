import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { SidebarAnimationState } from '../consts/sidebar-animation.const';
import { PermissionsService } from '../../../core/permissions/services/permissions.service';
import { SidebarSessionStoreService } from './services/sidbebar-session-store.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  @Input() items: Array<SidebarItem> = [];

  constructor(private router: Router, public permissionsService: PermissionsService, private sessionService: SidebarSessionStoreService) {}

  ngOnInit() {
    this.updateItems(this.items);

    // subscribe to the NavigationEnd event
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateItems(this.items);
    });
  }

  toggleDropdown(item: SidebarItem) {
    const state = item.opened === SidebarAnimationState.open ? SidebarAnimationState.close : SidebarAnimationState.open;
    item.opened = state;

    if (item.children && item.children.length > 0) {
      this.sessionService.setSidebarLayout(item.title, state);
    }
  }

  // isOpened(item: SidebarItem) {
  //   return item.opened === SidebarAnimationState.open;
  // }

  /**
   * Closes or opens item links based on active route
   */
  private updateItems(items: Array<SidebarItem>) {
    for (const item of items) {
      if (this.router.isActive(item.routeLink, false)) {
        item.opened = SidebarAnimationState.open;

        if (item.children && item.children.length > 0) {
          this.sessionService.setSidebarLayout(item.title, SidebarAnimationState.open);
        }
      } else {
        item.opened = this.sessionService.getSidebarLayout(item.title);
      }

      if (item.children && item.children.length > 0) {
        this.updateItems(item.children);
      }
    }
  }

  hasAccess(item: SidebarItem): boolean {
    if (item.permission) {
      return this.permissionsService.hasAccess(item.permission);
    } else {
      return true;
    }
  }

  hasActiveChildLinks(item: SidebarItem, result = false) {
    _.each(item.children, x => {
      if (this.hasAccess(x)) {
        result = true;
      }
      return this.hasActiveChildLinks(x, result);
    });

    return result;
  }
}

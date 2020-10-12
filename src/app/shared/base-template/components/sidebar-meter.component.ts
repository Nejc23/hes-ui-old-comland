import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { SidebarAnimationState } from '../consts/sidebar-animation.const';
import { VERSION } from 'src/environments/version';
import { PermissionsService } from '../../../core/permissions/services/permissions.service';

@Component({
  selector: 'app-sidebar-meter',
  templateUrl: './sidebar-meter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidebarMeterComponent implements OnInit {
  @Input() items: Array<SidebarItem> = [];
  public version = '';

  constructor(private router: Router, public permissionsService: PermissionsService) {}

  ngOnInit() {
    this.version = `${VERSION.version} - ${VERSION.hash}`;
    this.updateItems(this.items);

    // subscribe to the NavigationEnd event
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.updateItems(this.items);
    });
  }

  toggleDropdown(item: SidebarItem) {
    item.opened = item.opened === SidebarAnimationState.open ? SidebarAnimationState.close : SidebarAnimationState.open;
  }

  isOpened(item: SidebarItem) {
    return item.opened === SidebarAnimationState.open;
  }

  /**
   * Closes or opens item links based on active route
   */
  private updateItems(items: Array<SidebarItem>) {
    for (const item of items) {
      if (this.router.isActive(item.routeLink, false)) {
        item.opened = SidebarAnimationState.open;
      } else {
        item.opened = SidebarAnimationState.close;
      }

      if (item.children) {
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

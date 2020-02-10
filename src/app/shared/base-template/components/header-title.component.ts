import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { SidebarService } from '../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html'
})
export class HeaderTitleComponent implements OnInit, OnDestroy {
  headerTitle: string;
  subscription: Subscription;

  constructor(private sidebarService: SidebarService, private i18n: I18n, private router: Router) {
    this.headerTitle = this.i18n('Dashboards');

    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.headerTitle = this.sidebarService.headerTitle;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

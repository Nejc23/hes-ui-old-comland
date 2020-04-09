import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html'
})
export class HeaderTitleComponent implements OnInit, OnDestroy {
  @Input() headerTitle: string;
  subscription: Subscription;

  constructor(private sidebarService: SidebarService, private router: Router, private i18n: I18n) {
    this.headerTitle = this.i18n(`Dashboards`);

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

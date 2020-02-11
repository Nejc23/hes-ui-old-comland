import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html'
})
export class HeaderTitleComponent implements OnInit, OnDestroy {
  headerTitle: string;
  subscription: Subscription;

  constructor(private sidebarService: SidebarService, private router: Router) {
    this.headerTitle = $localize`Dashboards`;

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

import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { themeColors } from './shared/base-template/consts/theme-colors.const';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { brand } from 'src/environments/brand/default/brand';
import { AuthService } from './core/auth/services/auth.service';
import { IntlService, CldrIntlService } from '@progress/kendo-angular-intl';
import { SidebarService } from './core/base-template/services/sidebar.service';
import { SidebarItem } from './shared/base-template/interfaces/sidebar-item.interface';
import { Router } from '@angular/router';
import { PermissionService } from './core/permissions/services/permission.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private titleService: Title,
    public authService: AuthService,
    public intlService: IntlService,
    private router: Router,
    private permissionService: PermissionService,
    public sidebarService: SidebarService
  ) {
    debugger;
    moment.locale(locale);
    console.log(locale);
    this.locale = locale;
    (this.intlService as CldrIntlService).localeId = locale;
  }

  ngOnInit(): void {
    // TODO: complete this
    // this.authService.setRefreshTokenInterval();
    this.titleService.setTitle(brand.appBrowserTitle);
    this.authService
      .getUser()
      .then((user) => {
        this.authService.user = user;
        if (user) {
          this.authService.saveTokenAndSetUserRights2(user, '');

          this.redirectToDefaultPage();
        } else {
          console.log('User Not Logged In');
        }
      })
      .catch((err) => console.log(err));
  }

  getProgressBarColor() {
    return themeColors.primary;
  }

  redirectToDefaultPage() {
    const routeLink = this.getFirstLinkWithAccess(this.sidebarService.getSidebarItems());
    if (routeLink) {
      this.router.navigate([routeLink]);
    } else {
      console.log('User is without any permissions');
    }
  }

  getFirstLinkWithAccess(sidebarItems: SidebarItem[]): string {
    for (const item of sidebarItems) {
      if (item.permission && this.permissionService.hasAccess(item.permission)) {
        return item.routeLink;
      }

      if (item.children?.length > 0) {
        const routeLink = this.getFirstLinkWithAccess(item.children);
        if (routeLink) {
          return routeLink;
        }
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { themeColors } from './shared/base-template/consts/theme-colors.const';
import { Title } from '@angular/platform-browser';
import { brand } from 'src/environments/brand/default/brand';
import { AuthService } from './core/auth/services/auth.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { SidebarService } from './core/base-template/services/sidebar.service';
import { SidebarItem } from './shared/base-template/interfaces/sidebar-item.interface';
import { Router } from '@angular/router';
import { PermissionService } from './core/permissions/services/permission.service';
import { LanguageService } from './core/base-template/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private titleService: Title,
    public authService: AuthService,
    public intlService: IntlService,
    private router: Router,
    private permissionService: PermissionService,
    public sidebarService: SidebarService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.selectLang(localStorage.getItem('lang') || 'en');
    console.log('Selected language: ' + this.languageService.selectedLang.id);
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
    let currentUrl = window.location.href.substring(window.location.href.indexOf('#') + 1, window.location.href.length);
    let item = sidebarItems.find((item) => currentUrl.indexOf(item.routeLink) !== -1);

    if (sidebarItems.find((item) => currentUrl.indexOf(item.routeLink) !== -1) && this.permissionService.hasAccess(item.permission)) {
      return currentUrl;
    }

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

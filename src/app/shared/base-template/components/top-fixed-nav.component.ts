import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { brand } from 'src/environments/brand/default/brand';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LanguageService } from 'src/app/core/base-template/services/language.service';
import { Language, languages } from 'src/environments/config';
import { AppConfigService } from '../../../core/configuration/services/app-config.service';

@Component({
  selector: 'app-top-fixed-nav',
  templateUrl: './top-fixed-nav.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TopFixedNavComponent implements OnInit {
  userName = '';
  initials = '';
  company = '';
  email = '';

  languages$: Array<Language>;
  language = 'English';

  constructor(public authService: AuthService, private languageService: LanguageService) {}

  ngOnInit() {
    this.languages$ = languages;

    this.userName = this.authService.getLoggedUser();
    this.initials = this.authService.getUserInitials();
    this.company = this.authService.getUserCompany();
    this.email = this.authService.getUserEmail();
  }

  getSmallLogoUrl() {
    return brand.navFixedLogoUrl;
  }

  getMenuMainLogoUrl() {
    return brand.navFixedMenuMainUrl;
  }

  selectLang(id: string) {
    this.languageService.selectLang(id);
  }

  profile() {
    window.open(AppConfigService.settings.identityServer.stsAuthorityWeb, '_blank');
  }

  logout() {
    this.authService.logout();
  }

  addSelectedClass(lang: string) {
    if (this.languageService.getLang().id === lang) {
      return 'active';
    }
    return '';
  }
}

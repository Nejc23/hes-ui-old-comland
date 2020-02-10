import { Component, OnInit, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { SidebarService } from '../services/sidebar.service';
import { VERSION } from 'src/environments/version';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/environments/config';
import { languages } from 'src/environments/locale';
import { Codelist } from '../../forms/interfaces/codelist.interface';
import { LanguageService } from '../services/language.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  providers: []
})
export class BaseTemplateComponent implements OnInit {
  public app: any;
  public headerThemes: any;
  public changeHeader: any;
  public sidenavThemes: any;
  public changeSidenav: any;
  public headerSelected = 'header-default';
  public sidenavSelected = 'sidenav-default';
  public version = '';
  public sidebarItems: Array<SidebarItem> = [];

  languages$: Codelist<string>[];
  language = 'English';
  collapsed = true;

  screenHeight: number;
  screenWidth: number;

  constructor(
    private sidebarService: SidebarService,
    private cookieService: CookieService,
    private languageService: LanguageService,
    @Inject(LOCALE_ID) private locale: string,
    public i18n: I18n
  ) {
    this.app = {
      layout: {
        sidePanelOpen: true,
        isMenuOpened: true,
        isMenuCollapsed: false,
        themeConfigOpen: false,
        rtlActived: false
      }
    };
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    // console.log(`SCREEN SIZE = ${this.screenWidth}, ${this.screenHeight}`);
    if (this.screenWidth < 577) {
      this.sidebarItems = this.sidebarService.getSidebarItemsMobile();
    } else {
      this.sidebarItems = this.sidebarService.getSidebarItems();
    }
  }

  ngOnInit() {
    this.languages$ = languages;
    this.version = VERSION.version + ' - ' + VERSION.hash;

    this.language = this.languages$.find(x => x.id === this.locale).value;
  }

  @HostListener('click', ['$event.target'])
  onClick(btn) {
    this.cookieService.set(
      config.authTimeStamp,
      moment()
        .utc()
        .toISOString(),
      null,
      environment.cookiePath
    );
  }

  selectLang(id: string) {
    this.languageService.selectLang(id);
  }
}

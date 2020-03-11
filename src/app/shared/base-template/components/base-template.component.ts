import { Component, OnInit, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { VERSION } from 'src/environments/version';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/environments/config';
import { languages } from 'src/environments/locale';
import { environment } from 'src/environments/environment';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { Codelist } from '../../repository/interfaces/codelists/codelist.interface';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  public isMouseOverNav = false;

  languages$: Codelist<string>[];
  companies$: Observable<Codelist<number>[]>;
  companies: Codelist<number>[] = [];

  screenHeight: number;
  screenWidth: number;

  form: FormGroup;
  selectedCompany: Codelist<number>;

  constructor(
    private sidebarService: SidebarService,
    private cookieService: CookieService,
    @Inject(LOCALE_ID) private locale: string,
    public i18n: I18n,
    private formBuilder: FormBuilder
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
    this.form = this.createForm();
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
    this.companies.push(
      { id: 1, value: 'Eles' },
      { id: 2, value: 'Company 2' },
      { id: 3, value: 'Company 3' },
      { id: 4, value: 'Company 4' }
    );
    this.selectedCompany = this.companies[0];
    this.companies$ = of(this.companies);
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      ['companyId']: [1]
    });
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

  mouseOverNav() {
    this.isMouseOverNav = this.app.layout.isMenuCollapsed;
  }

  mouseLeavesNav() {
    this.isMouseOverNav = false;
  }

  get companyIdProperty() {
    return 'companyId';
  }
}

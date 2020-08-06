import { Component, OnInit, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { VERSION } from 'src/environments/version';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/environments/config';
import { environment } from 'src/environments/environment';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { Codelist } from '../../repository/interfaces/codelists/codelist.interface';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { transition, trigger, style, animate } from '@angular/animations';
import { Route, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MeterTypeRoute } from '../enums/meter-type.enum';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  providers: [],
  animations: [trigger('navItemsTrigger', [transition(':enter', [style({ opacity: 0 }), animate('300ms 200ms', style({ opacity: 1 }))])])]
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
  public sidebarMeterUnitsItems: Array<SidebarItem> = [];
  public sidebarConfigurationItems: Array<SidebarItem> = [];
  public isMouseOverNav = false;
  public submenu = 0;
  public organisation = this.i18n('no organisation');

  // languages$: Codelist<string>[];
  companies$: Observable<Codelist<number>[]>;

  screenHeight: number;
  screenWidth: number;

  form: FormGroup;
  selectedCompany: Codelist<number>;

  constructor(
    private sidebarService: SidebarService,
    private cookieService: CookieService,
    @Inject(LOCALE_ID) private locale: string,
    public i18n: I18n,
    //  private formBuilder: FormBuilder,
    private router: Router,
    private codeList: CodelistMeterUnitsRepositoryService,
    //  private codelistAuth: CodelistRepositoryService,
    private auth: AuthService
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
    // this.form = this.createForm();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl.includes('/meterUnits')) {
          this.submenu = 1;
        } else if (currentUrl.includes('/configuration')) {
          this.submenu = 2;
        } else {
          this.submenu = 0;
        }
      }
    });
  }

  /*  reloadPage(selected: Codelist<number>) {
    // get changed Token
//      const helper = new JwtHelperService();
//    console.log(this.auth.user.id_token);
//    const token = this.auth.user.id_token
//    const decodedToken = helper.decodeToken(token);

    console.log(selected);
    this.auth.user.profile.company_name = selected.value;
    this.auth.storeUser();
    window.location.reload();
  }*/

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
    // fill submenu for meter units
    this.fillMeterUnits();
    // fill submenu for configuration
    this.fillConfiguration();
  }

  fillMeterUnits() {
    const sidebarItems = this.sidebarService.getSidebarMeterUnitsItems();
    this.codeList.meterUnitTypeCodelist().subscribe(list => {
      if (list && list.length > 0) {
        list.forEach(element => {
          const newElement = {
            title: this.i18n(element.value),
            routeLink: `/${MeterTypeRoute.meterUnits}/${element.id}`,
            hasChildren: false,
            children: []
          };
          sidebarItems.push(newElement);
        });

        // add All to the menu
        const allElement = {
          title: this.i18n('All'),
          routeLink: `/${MeterTypeRoute.meterUnitsAll}`,
          hasChildren: false,
          children: []
        };
        sidebarItems.push(allElement);

        this.sidebarMeterUnitsItems = sidebarItems;
      }
    });
  }

  fillConfiguration() {
    this.sidebarConfigurationItems = this.sidebarService.getSidebarConfigurationItems();
  }

  ngOnInit() {
    // this.languages$ = languages;
    this.version = VERSION.version + ' - ' + VERSION.hash;

    if (this.auth.user.profile != null && this.auth.user.profile.company_name.length > 0) {
      this.organisation = this.auth.user.profile.company_name;
    }
    /*this.codelistAuth.companyCodelist().subscribe(value => {
      this.companies$ = of(value);
      if (value.length > 1 && this.auth.user && this.auth.user.profile && this.auth.user.profile.company_name) {
        const company = value.find(x => x.value == this.auth.user.profile.company_name);
        if (company != null) {
          this.selectedCompany = company;
        }
      }
    });*/
  }

  /*createForm(): FormGroup {
    return this.formBuilder.group({
      ['companyId']: [1]
    });
  }*/

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

  /*  get companyIdProperty() {
    return 'companyId';
  }*/
}

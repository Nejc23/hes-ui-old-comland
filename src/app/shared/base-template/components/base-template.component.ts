import { Component, OnInit, HostListener } from '@angular/core';
import { SidebarItem } from '../interfaces/sidebar-item.interface';
import { VERSION } from 'src/environments/version';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/environments/config';
import { environment } from 'src/environments/environment';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { Codelist } from '../../repository/interfaces/codelists/codelist.interface';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { transition, trigger, style, animate } from '@angular/animations';
import { MeterTypeRoute } from '../enums/meter-type.enum';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { brand } from 'src/environments/brand/default/brand';
import { ActivatedRoute } from '@angular/router';

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
  public organisation = $localize`no organisation`;

  // languages$: Codelist<string>[];
  companies$: Observable<Codelist<number>[]>;

  screenHeight: number;
  screenWidth: number;

  form: FormGroup;
  selectedCompany: Codelist<number>;

  pageTitle = '';

  constructor(
    private sidebarService: SidebarService,
    private cookieService: CookieService,
    private codeList: CodelistMeterUnitsRepositoryService,
    //  private codelistAuth: CodelistRepositoryService,
    private auth: AuthService,
    private acitavedRouter: ActivatedRoute
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

    /*this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl.includes('/meterUnits')) {
          this.submenu = 1;
        } else if (currentUrl.includes('/configuration')) {
          this.submenu = 2;

        } else {
          this.submenu = 0;
        }
        // if (currentUrl.includes('/schedulerJobs/allForJob')) {
        //   acitavedRouter.queryParams.subscribe(qParams => {
        //     this.fillMeterUnits(qParams.scheduleId);
        //   });
        // }
      }
    });*/
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
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    // console.log(`SCREEN SIZE = ${this.screenWidth}, ${this.screenHeight}`);
    if (this.screenWidth < 577) {
      this.sidebarItems = this.sidebarService.getSidebarItemsMobile();
    } else {
      this.sidebarItems = this.sidebarService.getSidebarItems();
    }
    // fill submenu for meter units
    //     this.fillMeterUnits();
    // fill submenu for configuration
    //   this.fillConfiguration();
  }

  fillMeterUnits() {
    const sidebarItems = this.sidebarService.getSidebarItems();
    console.log(sidebarItems);
    this.codeList.meterUnitTypeCodelist().subscribe(list => {
      if (list && list.length > 0) {
        list.forEach(element => {
          const newElement = {
            title: $localize`${element.value}`,
            routeLink: `/${MeterTypeRoute.meterUnits}/${element.id}`,
            hasChildren: false,
            children: []
          };
          sidebarItems[1].children.push(newElement);
          sidebarItems[1].hasChildren = true;
        });

        this.sidebarMeterUnitsItems = sidebarItems;
      }
    });
  }

  /* fillConfiguration() {
    this.sidebarConfigurationItems = this.sidebarService.getSidebarConfigurationItems();
  }*/

  ngOnInit() {
    this.fillMeterUnits();
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
  onClick() {
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

  getSmallLogoUrl() {
    return brand.navFixedLogoUrl;
  }

  getMenuMainLogoUrl() {
    return brand.navFixedMenuMainUrl;
  }

  getAppTitle() {
    return brand.appTitle;
  }

  /*  get companyIdProperty() {
    return 'companyId';
  }*/
}

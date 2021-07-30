import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { Breadcrumb } from '../interfaces/breadcrumb.interface';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: Breadcrumb[];
  public pageName: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: BreadcrumbService,
    private translate: TranslateService
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);

    // subscribe to the NavigationEnd event
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      // set breadcrumbs
      const root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.buildBreadCrumb(root);
    });

    this.service.eventEmitterSetPageName.subscribe((pageName) => {
      this.pageName = pageName;
    });

    this.service.eventEmitterSetBreadcrumbs.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<Breadcrumb> = []): Array<Breadcrumb> {
    debugger;
    // If no routeConfig is avalailable we are on the root path
    const label = _.get(route, 'routeConfig.data.breadcrumb', null);
    const path = route.routeConfig ? route.routeConfig.path : '';
    const params = route.snapshot.params;

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = this.replaceParamsInUrl(`${url}${path}/`, params);

    const breadcrumb: Breadcrumb = {
      label,
      params,
      url: nextUrl
    };

    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : breadcrumbs;
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }

  replaceParamsInUrl(url: string, params: Params): string {
    return _.reduce(
      params,
      (result, value, key) => {
        return _.replace(result, ':' + key, value);
      },
      url
    );
  }

  /*getBreadcrumbLabel(breadcrumb: Breadcrumb) {
    return  '' //   `{{label}}`, { label: breadcrumb.label };
  }*/

  showBreadcrumb(): boolean {
    return this.breadcrumbs && this.breadcrumbs.length > 0 && this.breadcrumbs[0].label !== this.pageName;
  }
}

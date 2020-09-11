import { I18n } from '@ngx-translate/i18n-polyfill';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.component.html'
})
export class Page404Component implements OnInit {
  constructor(public router: Router, private breadcrumbService: BreadcrumbService, private i18n: I18n) {}

  ngOnInit() {
    this.breadcrumbService.setPageName(this.i18n('404 - page not exists'));
  }
}

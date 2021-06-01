import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.component.html'
})
export class Page404Component implements OnInit {
  constructor(public router: Router, private breadcrumbService: BreadcrumbService, private translate: TranslateService) {}

  ngOnInit() {
    this.breadcrumbService.setPageName(this.translate.instant('2543774249742331958'));
  }
}

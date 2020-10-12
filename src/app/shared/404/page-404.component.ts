import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.component.html'
})
export class Page404Component implements OnInit {
  constructor(public router: Router, private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setPageName($localize`404 - page not exists`);
  }
}

import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.component.html'
})
export class Page404Component implements OnInit {
  constructor(private sidebatService: SidebarService, private i18n: I18n) {
    this.sidebatService.headerTitle = this.i18n(``);
  }

  ngOnInit() {}
}

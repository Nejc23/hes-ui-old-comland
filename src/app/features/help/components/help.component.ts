import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    private router: Router,
    private route: ActivatedRoute,
    private i18n: I18n,
    private sidebarService: SidebarService
  ) {
    this.sidebarService.headerTitle = this.i18n('Help');
  }

  ngOnInit() {}
}

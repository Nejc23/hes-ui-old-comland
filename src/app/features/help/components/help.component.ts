import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) public localeId: string, private sidebarService: SidebarService, private i18n: I18n) {
    this.sidebarService.headerTitle = this.i18n(`Help`);
  }

  ngOnInit() {}
}

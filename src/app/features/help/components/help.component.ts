import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) public localeId: string, private sidebarService: SidebarService) {
    this.sidebarService.headerTitle = $localize`Help`;
  }

  ngOnInit() {}
}

import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { themeColors } from './shared/base-template/consts/theme-colors.const';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { brand } from 'src/environments/brand/default/brand';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) private locale: string, private titleService: Title) {
    moment.locale(locale);
  }

  ngOnInit(): void {
    // TODO: complete this
    // this.authService.setRefreshTokenInterval();
    this.titleService.setTitle(brand.appBrowserTitle);
  }

  getProgressBarColor() {
    return themeColors.primary;
  }
}

import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { themeColors } from './shared/base-template/consts/theme-colors.const';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    moment.locale(locale);
  }

  ngOnInit(): void {
    // TODO: complete this
    // this.authService.setRefreshTokenInterval();
  }

  getProgressBarColor() {
    return themeColors.primary;
  }
}

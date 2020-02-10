import { Component, OnInit } from '@angular/core';
import { themeColors } from './shared/base-template/consts/theme-colors.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // TODO: complete this
    // this.authService.setRefreshTokenInterval();
  }

  getProgressBarColor() {
    return themeColors.primary;
  }
}

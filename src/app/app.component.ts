import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { themeColors } from './shared/base-template/consts/theme-colors.const';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { brand } from 'src/environments/brand/default/brand';
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) private locale: string, private titleService: Title, public authService: AuthService) {
    moment.locale(locale);
  }

  ngOnInit(): void {
    // TODO: complete this
    // this.authService.setRefreshTokenInterval();
    this.titleService.setTitle(brand.appBrowserTitle);

    this.authService
      .getUser()
      .then(user => {
        //  this.currentUser = user;
        this.authService.user = user;
        if (user) {
          this.authService.saveTokenAndSetUserRights2(user);
        } else {
          console.log('User Not Logged In');
        }
      })
      .catch(err => console.log(err));
  }

  getProgressBarColor() {
    return themeColors.primary;
  }
}

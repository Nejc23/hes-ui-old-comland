import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { brand } from 'src/environments/brand/default/brand';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-side-fixed-nav',
  templateUrl: './side-fixed-nav.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SideFixedNavComponent implements OnInit {
  // @ViewChild('title', { static: true }) title2: ElementRef;
  userName = '';
  initials = '';
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.userName = this.authService.getLoggedUser();
    this.initials = this.authService.getUserInitials();
  }

  getSmallLogoUrl() {
    return brand.navFixedLogoUrl;
  }

  getMenuMainLogoUrl() {
    return brand.navFixedMenuMainUrl;
  }

  logout() {
    this.authService.logout();
  }
}

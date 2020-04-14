import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { brand } from 'src/environments/brand/default/brand';

@Component({
  selector: 'app-side-fixed-nav',
  templateUrl: './side-fixed-nav.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SideFixedNavComponent implements OnInit {
  // @ViewChild('title', { static: true }) title2: ElementRef;
  constructor() {}

  ngOnInit() {}

  getSmallLogoUrl() {
    return brand.navFixedLogoUrl;
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() status: 'INACTIVE' | 'UNKNOWN' | 'MOUNTED' | 'ACTIVE'; // todo check -> enum

  constructor() {}

  ngOnInit(): void {
    this.status = 'ACTIVE';
  }

  addBgColor() {
    switch (this.status) {
      case 'INACTIVE':
        return 'tw-bg-red';
      case 'ACTIVE':
        return 'tw-bg-green';
      default:
        return 'tw-bg-black';
    }
  }
}

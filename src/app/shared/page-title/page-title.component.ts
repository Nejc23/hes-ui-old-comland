import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() status: 'INACTIVE' | 'UNKNOWN' | 'MOUNTED' | 'ACTIVE';

  constructor() {}

  addClass() {
    switch (this.status) {
      case 'INACTIVE':
        return 'inactive';
      case 'ACTIVE':
        return 'active';
      default:
        return 'undefined';
    }
  }
}

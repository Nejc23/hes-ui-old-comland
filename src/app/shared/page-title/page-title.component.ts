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

  addStatusClass() {
    switch (this.status) {
      case 'INACTIVE':
        return 'inactive-status';
      case 'ACTIVE':
        return 'active-status';
      default:
        return 'undefined-status';
    }
  }
}

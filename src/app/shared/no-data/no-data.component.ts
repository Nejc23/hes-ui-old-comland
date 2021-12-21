import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent {
  @Input() loading = false;

  @Input() message = 'COMMON.NO-DATA-FOUND';
  @Input() secondaryMessage = '';
  @Input() iconName = '';

  @Input() alert = false; // red alert

  constructor() {}
}

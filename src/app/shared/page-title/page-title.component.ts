import { Component, Input } from '@angular/core';
import { DeviceState } from '../../core/repository/interfaces/meter-units/meter-unit-details.interface';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() state: DeviceState;

  constructor() {}

  addStateClass() {
    switch (this.state.toLowerCase()) {
      case DeviceState.DISABLED.toLowerCase(): // blue
        return 'disabled-state';
      case DeviceState.OPERATIONAL.toLowerCase(): // green
        return 'operational-state';
      case DeviceState.INSTALLING.toLowerCase(): // yellow
        return 'installing-state';
      default:
        return 'inactive-status'; // black for not defined status
    }
  }
}

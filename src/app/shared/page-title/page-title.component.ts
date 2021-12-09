import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() backButton = false;

  @Output() backButtonClickedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  addStateClass() {
    switch (this.state.toLowerCase()) {
      case DeviceState.DISABLED.toLowerCase(): // gray
        return 'disabled-state';
      case DeviceState.OPERATIONAL.toLowerCase(): // green
        return 'operational-state';
      case DeviceState.INSTALLING.toLowerCase(): // yellow
        return 'installing-state';
      case DeviceState.DRAFT.toLowerCase():
        return 'disabled-state';
      default:
        return 'inactive-status'; // black for not defined status
    }
  }

  backButtonClicked() {
    this.backButtonClickedEvent.emit(true);
  }
}

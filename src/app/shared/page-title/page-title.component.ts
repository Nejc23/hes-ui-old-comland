import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceState } from '../../core/repository/interfaces/meter-units/meter-unit-details.interface';
import { Router } from '@angular/router';

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
  @Input() routerUrl = '';
  @Input() stateToolTipMessage = '';

  @Output() backButtonClickedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  addStateClass() {
    switch (this.state.toLowerCase()) {
      case DeviceState.DISABLED.toLowerCase(): // gray
      case DeviceState.DRAFT.toLowerCase():
        return 'disabled-state';
      case DeviceState.OPERATIONAL.toLowerCase(): // green
      case DeviceState.EDIT.toLowerCase():
        return 'operational-state';
      case DeviceState.INSTALLING.toLowerCase(): // yellow
        return 'installing-state';
      case DeviceState.REKEYING.toLowerCase():
        return 'rekeying-state';
      default:
        return 'inactive-status'; // black for not defined status
    }
  }

  backButtonClicked() {
    if (this.routerUrl !== '') {
      this.router.navigate([this.routerUrl]);
    }
    this.backButtonClickedEvent.emit(true);
  }
}

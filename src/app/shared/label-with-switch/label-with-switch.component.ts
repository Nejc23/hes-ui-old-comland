import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-label-with-switch',
  templateUrl: './label-with-switch.component.html',
  styleUrls: ['./label-with-switch.component.scss']
})
export class LabelWithSwitchComponent {
  @Input() message = '';
  @Input() secondaryMessage = '';
  @Input() property = '';
  @Input() controlId = '';
  @Input() form: FormGroup;
  @Input() topBorder = true;
  @Input() bottomBorder = true;

  @Output() switchChangedEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  switchChanged(event: boolean) {
    this.switchChangedEvent.emit(event);
  }
}

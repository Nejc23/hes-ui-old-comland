import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-out-component',
  templateUrl: './slide-out-component.component.html',
  styleUrls: ['./slide-out-component.component.scss']
})
export class SlideOutComponentComponent {
  @Input() visible = true;
  @Input() contentClass = '';
  @Input() title = '';

  @Output() closeButtonClickedEvent = new EventEmitter<boolean>();

  constructor() {}

  close() {
    this.closeButtonClickedEvent.emit(true);
  }
}

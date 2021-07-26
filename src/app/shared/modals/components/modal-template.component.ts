import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html'
})
export class ModalTemplateComponent {
  @Output() dismiss = new EventEmitter();
  constructor() {}

  close() {
    this.dismiss.emit();
  }
}

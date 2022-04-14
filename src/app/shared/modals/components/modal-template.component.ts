import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html'
})
export class ModalTemplateComponent {
  @Input() loading = false;
  @Output() dismiss = new EventEmitter();

  constructor() {}

  close() {
    this.dismiss.emit();
  }
}

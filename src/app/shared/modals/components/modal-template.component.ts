import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html'
})
export class ModalTemplateComponent implements OnInit {
  @Output() dismiss = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  close() {
    this.dismiss.emit();
  }
}

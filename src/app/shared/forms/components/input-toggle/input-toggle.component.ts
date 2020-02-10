import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-input-toggle',
  templateUrl: './input-toggle.component.html'
})
export class InputToggleComponent implements OnInit {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;

  // Optional
  @Input() toggleTitle: string;

  controlId: string;

  constructor() {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputToggleComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputToggleComponent - property input missing.');
    }
    this.controlId = _.uniqueId('toggle');
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }
}

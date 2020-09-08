import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-input-checkbox-grid',
  templateUrl: './input-checkbox-grid.component.html'
})
export class InputCheckboxGridComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() indeterminate = false;
  @Input() label = '';

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputCheckboxComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputCheckboxComponent - property input missing.');
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }
}

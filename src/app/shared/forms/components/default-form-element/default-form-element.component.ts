import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-default-form-element',
  templateUrl: './default-form-element.component.html'
})
export class DefaultFormElementComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('DefaultFormElement - form input missing.');
    }
    if (!this.property) {
      throw Error('DefaultFormElement - property input missing.');
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}

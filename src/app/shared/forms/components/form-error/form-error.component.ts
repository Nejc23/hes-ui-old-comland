import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html'
})
export class FormErrorComponent {
  public errors: Array<string> = []; // public because of translation error
  private translations = {};

  constructor() {
    this.translations = {
      required: $localize`Required field`,
      email: $localize`Entry is not a valid email`,
      maxlength: $localize`Entry exceeds maximum amount of characters`,
      minlength: $localize`Entry does not meet minimum required amount of characters`,
      pattern: $localize`Wrong format`,
      notMatchPassword: $localize`Password not match`,
      max: $localize`Exceeds max value`,
      min: $localize`Exceeds min value`,
      maxError: $localize`Exceeds max value`,
      minError: $localize`Exceeds min value`,
      incorrectRange: $localize`Range is incorect`,
      numberError: $localize`Entry is not a valid integer:`,
      emailError: $localize`Entry is not a valid email:`
    };
  }

  @Input()
  set error(error: any) {
    console.log(`error = `, error);
    this.errors = [];
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        let text = _.get(this.translations, key, this.errors[key]);
        if (key === 'max') {
          text = `${text} (${error.max.max})`;
        }
        if (key === 'min') {
          text = `${text} (${error.min.min})`;
        }

        // handle errors from kendo-numerictextbox
        if (key === 'maxError') {
          text = `${text} (${error.maxError.maxValue})`;
        }
        if (key === 'minError') {
          text = `${text} (${error.minError.minValue})`;
        }

        // handle error for kendo-multiselect
        if (key === 'numberError') {
          text = `${text} ${error.numberError.value}`;
        }
        if (key === 'emailError') {
          text = `${text} ${error.emailError.value}`;
        }
        this.errors.push(text);
      }
    }
  }
}

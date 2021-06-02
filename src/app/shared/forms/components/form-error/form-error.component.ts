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
      required: `Required field`,
      email: `Entry is not a valid email`,
      maxlength: `Entry exceeds maximum amount of characters`,
      minlength: `Entry does not meet minimum required amount of characters`,
      pattern: `Wrong format`,
      notMatchPassword: `Password not match`,
      max: `Exceeds max value`,
      min: `Exceeds min value`,
      maxError: `Exceeds max value`,
      minError: `Exceeds min value`,
      incorrectRange: `Range is incorect`,
      numberError: `Entry is not a valid integer:`,
      emailError: `Entry is not a valid email:`
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

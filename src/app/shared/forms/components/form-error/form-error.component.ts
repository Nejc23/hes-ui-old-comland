import { Component, Input } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html'
})
export class FormErrorComponent {
  public errors: Array<string> = []; // public because of translation error
  private translations = {};

  constructor(private i18n: I18n) {
    this.translations = {
      required: this.i18n(`Required field`),
      email: this.i18n(`Entry is not a valid email`),
      maxlength: this.i18n(`Entry exceeds maximum amount of characters`),
      minlength: this.i18n(`Entry does not meet minimum required amount of characters`),
      pattern: this.i18n(`Wrong format`),
      notMatchPassword: this.i18n(`Password not match`),
      max: this.i18n(`Exceeds max value`),
      min: this.i18n(`Exceeds min value`),
      incorrectRange: this.i18n(`Range is incorect`)
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
        this.errors.push(text);
      }
    }
  }
}

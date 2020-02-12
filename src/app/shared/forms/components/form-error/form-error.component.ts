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
      notMatchPassword: $localize`Password not match`
    };
  }

  @Input()
  set error(error: any) {
    this.errors = [];
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        const text = _.get(this.translations, key, this.errors[key]);

        this.errors.push(text);
      }
    }
  }
}

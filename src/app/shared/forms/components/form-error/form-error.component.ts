import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html'
})
export class FormErrorComponent {
  public errors: Array<string> = []; // public because of translation error
  private translations = {};

  constructor(private translate: TranslateService) {
    this.translations = {
      required: this.translate.instant('FORM.ERROR.REQUIRED'),
      email: this.translate.instant('FORM.ERROR.EMAIl'),
      maxlength: this.translate.instant('FORM.ERROR.MAXLENGTH'),
      minlength: this.translate.instant('FORM.ERROR.MINLENGTH'),
      pattern: this.translate.instant('FORM.ERROR.PATTERN'),
      notMatchPassword: this.translate.instant('FORM.ERROR.NOT-MATCH'),
      invalidHostname: this.translate.instant('FORM.ERROR.INVALID-HOSTNAME'),
      invalidDuplicatedHostname: this.translate.instant('FORM.ERROR.DUPLICATED-HOSTNAME'),
      duplicatedSerialAndManufacturer: this.translate.instant('FORM.ERROR.DUPLICATED-SERIAL-MANUFACTURER'),
      max: this.translate.instant('FORM.ERROR.MAX'),
      min: this.translate.instant('FORM.ERROR.MIN'),
      maxError: this.translate.instant('FORM.ERROR.MAX'),
      minError: this.translate.instant('FORM.ERROR.MIN'),
      incorrectRange: this.translate.instant('FORM.ERROR.RANGE-INCORRECT'),
      numberError: this.translate.instant('FORM.ERROR.NUMBER-ERROR'),
      emailError: this.translate.instant('FORM.ERROR.EMAIL-ENTRY'),
      duplicatedId: this.translate.instant('FORM.ERROR.ID-EXIST')
    };
  }

  @Input() set overrideErrorPatternMessage(overrideErrorPatternMessage: string) {
    if (overrideErrorPatternMessage) {
      this.translations['pattern'] = this.translate.instant(overrideErrorPatternMessage);
    }
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

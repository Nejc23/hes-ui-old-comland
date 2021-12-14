import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-warning',
  templateUrl: './form-warning.component.html'
})
export class FormWarningComponent {
  public warnings: Array<string> = [];
  private translations = {};

  constructor(private translate: TranslateService) {
    this.translations = {
      VALID_DUPLICATED: this.translate.instant('FORM.WARNING.DUPLICATED')
    };
  }

  @Input()
  set warning(warning: any) {
    this.warnings = [];
    for (const key in warning) {
      const text = _.get(this.translations, warning[key], warning[key]);
      this.warnings.push(text);
    }
  }
}

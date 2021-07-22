import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormErrorContract } from '../../interfaces/custom-form-error.interface';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-custom-form-errors',
  templateUrl: './custom-form-errors.component.html'
})
export class CustomFormErrorsComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  subscription: Subscription;
  @Input() errorMessages: CustomFormErrorContract[];
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {
    if (!this.form) {
      throw Error('Custom form errors - form input missing.');
    }
    this.subscription = this.form.valueChanges.subscribe(() => {
      this.setErrorList();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setErrorList() {
    const currentErrors = _.reduce(
      this.form.errors,
      (res, current, index) => {
        const match = _.find(this.errorMessages, (x) => {
          return x.errorName === index;
        });

        return match ? [...res, match.errorDescription] : res;
      },
      []
    );
    this.errors = currentErrors;
  }

  showErrors(): boolean {
    return this.errors.length ? true : false;
  }
}

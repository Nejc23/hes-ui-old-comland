import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ToastNotificationService } from '../../toast-notification/services/toast-notification.service';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, switchMap, first, tap, take } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class FormsUtilsService {
  constructor(private toast: ToastNotificationService, private i18n: I18n) {}

  hasFormControlRequiredField = (abstractControl: AbstractControl): boolean => {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  };

  saveForm<T>(form: FormGroup, request: Observable<T>, successMessage: string): Observable<T> {
    const throwErrorOrMakeRequest = (formValid: boolean) => {
      if (!formValid) {
        return throwError(new Error(this.i18n(`invalid form`)));
      }
      return request;
    };

    return this.touchElementsAndValidate(form).pipe(
      switchMap(x => {
        return throwErrorOrMakeRequest(x);
      }),
      tap(() => {
        if (successMessage) {
          this.toast.successToast(successMessage);
        }
      }),
      first()
    );
  }

  deleteForm<T>(request: Observable<T>, successMessage: string): Observable<T> {
    const throwErrorOrMakeRequest = (formValid: boolean) => {
      return request;
    };

    return of(null).pipe(
      switchMap(x => {
        return throwErrorOrMakeRequest(x);
      }),
      tap(() => this.toast.successToast(successMessage)),
      first()
    );
  }

  touchAllFormElements(form: FormGroup) {
    _.each(form.controls, (x: AbstractControl) => {
      if (_.has(x, 'controls')) {
        this.touchAllFormElements(x as any);
      } else {
        x.markAsDirty();
      }
    });
  }

  touchElementsAndValidate(form: FormGroup): Observable<boolean> {
    this.touchAllFormElements(form);
    return of(null).pipe(
      map(() => this.throwErrorWithToastIfInvalid(form)),
      map(x => true),
      first(),
      catchError(x => of(false))
    );
  }

  throwErrorWithToastIfInvalid(form: FormGroup) {
    if (!form.valid) {
      // this.toast.warningToast(this.i18n(`Form not valid`));
      throw new Error(this.i18n(`invalid form`));
    }
  }

  shouldInputShowErrors(formControl: AbstractControl): boolean {
    return formControl.dirty && formControl.invalid;
  }
}

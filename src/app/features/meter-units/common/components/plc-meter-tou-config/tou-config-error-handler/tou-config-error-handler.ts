import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ErrorHelper } from 'src/app/features/helpers/error.helper';

@Injectable({
  providedIn: 'root'
})
export class TouConfigErrorHandler {
  constructor(private translate: TranslateService, private toast: ToastNotificationService, private errorHelper: ErrorHelper) {}

  showErrorsAsToasts(err: HttpErrorResponse) {
    const errors = this.errorHelper.tryCastErrorToArrayOfStrings(err.error);
    if (errors instanceof Array) {
      errors.forEach((errMsg) => {
        this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${errMsg}`));
      });
    } else {
      this.toast.errorToast(this.translate.instant('COMMON.OPERATION-FAILED'));
    }
  }
}

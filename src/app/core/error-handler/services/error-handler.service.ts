import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { ResponseError } from '../models/error-handler.model';
import { ToastNotificationService } from '../../toast-notification/services/toast-notification.service';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class ErrorHandlerService {
  constructor(private injector: Injector, private translate: TranslateService) {}

  showToast(error: ResponseError) {
    const notify = this.injector.get<ToastNotificationService>(ToastNotificationService);
    // const router = this.injector.get<Router>(Router);

    if (error) {
      // Handle Http Error (error.status === 403, 404...)
      if (error.status === 400) {
        notify.errorToast(_.get(error, 'error.message', this.translate.instant('FORM.ERROR.NOT-VALID-REQUEST')));
      }
      if (error.status === 401 || error.status === 403) {
        //  notify.errorToast(this.translate(`Authentication error`));
        //   router.navigate(['login']);
      }
      if (error.status === 404) {
        notify.errorToast(this.translate.instant('FORM.ERROR.ACTION-NOT-EXISTS'));
      }
      if (error.status === 500) {
        notify.errorToast(this.translate.instant('FORM.ERROR.UNKNOWN-ERROR'));
      }
    }
  }
}

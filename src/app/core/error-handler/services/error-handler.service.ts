import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ResponseError } from '../models/error-handler.model';
import { ToastNotificationService } from '../../toast-notification/services/toast-notification.service';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable()
export class ErrorHandlerService {
  constructor(private injector: Injector, private i18n: I18n) {}

  showToast(error: ResponseError) {
    const notify = this.injector.get<ToastNotificationService>(ToastNotificationService);
    const router = this.injector.get<Router>(Router);

    if (error) {
      // Handle Http Error (error.status === 403, 404...)
      if (error.status === 400) {
        notify.errorToast(_.get(error, 'error.message', this.i18n(`Not valid request`)));
      }
      if (error.status === 401 || error.status === 403) {
        notify.errorToast(this.i18n(`Authentication error`));
        router.navigate(['login']);
      }
      if (error.status === 404) {
        notify.errorToast(this.i18n(`Action not exists`));
      }
      if (error.status === 500) {
        notify.errorToast(this.i18n(`Unknown error`));
      }
    }
  }
}

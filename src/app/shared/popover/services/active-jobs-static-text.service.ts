import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsStaticTextService {
  constructor(private i18n: I18n) {}

  get notAvailableTekst() {
    return this.i18n('N/A');
  }

  get messageJobStopped() {
    return this.i18n(`Job stoped!`);
  }

  get messageJobCanceled() {
    return this.i18n(`Job canceled!`);
  }

  get messageServerError() {
    return this.i18n(`Server error!`);
  }
}

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsStaticTextService {
  constructor(private translate: TranslateService) {}

  get notAvailableTekst() {
    return this.translate.instant('COMMON.NA');
  }

  get messageJobStopped() {
    return this.translate.instant('JOB.JOB-STOPPED');
  }

  get messageJobCanceled() {
    return this.translate.instant('JOB.JOB-CANCELED');
  }

  get messageServerError() {
    return this.translate.instant('COMMON.SERVER-ERROR');
  }
}

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmsStaticTextService {
  constructor(private translate: TranslateService) {}

  get notAvailableTekst() {
    return this.translate.instant('COMMON.NA');
  }

  get noData() {
    return this.translate.instant('ALARM.NO-ALARMS');
  }

  get noRecordsFound() {
    return this.translate.instant('COMMON.NO-RECORDS');
  }

  get loadingData() {
    return this.translate.instant('GRID.LOADING-WITH-DOTS');
  }
}

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ImportDeviceKeysStaticTextService {
  constructor(private translate: TranslateService) {}

  get headerTitleImportDeviceKeys() {
    return this.translate.instant('MENU.IMPORT-DEVICE-KEYS');
  }

  get uploadSuccessful() {
    return this.translate.instant('COMMON.UPLOAD-SUCCESSFUL');
  }
}

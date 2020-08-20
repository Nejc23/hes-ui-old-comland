import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class ImportDeviceKeysStaticTextService {
  constructor(private i18n: I18n) {}

  get headerTitleImportDeviceKeys() {
    return this.i18n('Import device keys');
  }

  get uploadSuccessful() {
    return this.i18n('Upload successful!');
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportDeviceKeysStaticTextService {
  constructor() {}

  get headerTitleImportDeviceKeys() {
    return `Import device keys`;
  }

  get uploadSuccessful() {
    return `Upload successful`;
  }
}

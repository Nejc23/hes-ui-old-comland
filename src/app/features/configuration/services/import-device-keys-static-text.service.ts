import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportDeviceKeysStaticTextService {
  constructor() {}

  get headerTitleImportDeviceKeys() {
    return $localize`Import device keys`;
  }

  get uploadSuccessful() {
    return $localize`Upload successful`;
  }
}

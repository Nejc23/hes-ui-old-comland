import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class AgGridSharedFunctionsService {
  constructor(private i18n: I18n) {}

  public addSelectDeselectAllText() {
    const text = document.createElement('div');
    text.innerHTML = this.i18n('Select/deselect all columns');

    const panel = document.querySelector('[ref=primaryColsHeaderPanel]');

    if (panel !== undefined && panel !== null) {
      panel.appendChild(text);
    }
  }
}

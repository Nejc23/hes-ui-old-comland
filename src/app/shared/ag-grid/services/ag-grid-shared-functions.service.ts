import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AgGridSharedFunctionsService {
  constructor(private translate: TranslateService) {}

  public addSelectDeselectAllText() {
    const text = document.createElement('div');
    text.innerHTML = this.translate.instant('GRID.SELECT-DESELECT-ALL-COLUMNS');

    const panel = document.querySelector('[ref=primaryColsHeaderPanel]');

    if (panel !== undefined && panel !== null) {
      panel.appendChild(text);
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgGridSharedFunctionsService {
  constructor() {}

  public addSelectDeselectAllText() {
    const text = document.createElement('div');
    text.innerHTML = `Select/deselect all columns`;

    const panel = document.querySelector('[ref=primaryColsHeaderPanel]');

    if (panel !== undefined && panel !== null) {
      panel.appendChild(text);
    }
  }
}

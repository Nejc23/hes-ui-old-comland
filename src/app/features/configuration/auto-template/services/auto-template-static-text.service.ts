import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesStaticTextService {
  constructor() {}

  get title() {
    return `Auto Templates`;
  }

  get notAvailableTekst() {
    return `N/A`;
  }
}

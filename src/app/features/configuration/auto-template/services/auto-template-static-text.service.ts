import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesStaticTextService {
  constructor() {}

  get title() {
    return $localize `Auto Templates`;
  }

  get notAvailableTekst() {
    return $localize `N/A`;
  }
}

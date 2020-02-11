import { Injectable, Inject, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  selectLang(id: string) {
    if (this.locale !== id) {
      window.location.href = window.location.href.replace('/' + this.locale + '/', '/' + id + '/');
    }
  }
}

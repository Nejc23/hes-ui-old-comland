import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { Language, languages } from 'src/environments/config';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public selectedLang: Language;

  constructor(private translate: TranslateService, public intlService: IntlService) {}

  setLanguage(lang: string) {
    const language = this.findLanguage(lang);
    localStorage.setItem('lang', language.id);
    this.translate.use(language.id);
    this.selectedLang = language;
    (this.intlService as CldrIntlService).localeId = language.id;
  }

  findLanguage(lang: string) {
    if (!languages.find((lng) => lng.id === lang)) {
      return languages.find((lng) => lng.id === 'en');
    }
    return languages.find((lng) => lng.id === lang);
  }
}

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, languages } from 'src/environments/config';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public selectedLang: Language;

  constructor(private translate: TranslateService, public intlService: IntlService) {}

  selectLang(lang: string) {
    const language = this.findLanguage(lang);
    console.log('LANGUAGE CHANGED');
    console.log(language);
    localStorage.setItem('lang', language.id);
    this.translate.use(language.id);
    this.selectedLang = language;
    (this.intlService as CldrIntlService).localeId = language.id;
  }

  getLang(): Language {
    return this.selectedLang;
  }

  findLanguage(lang: string) {
    if (!languages.find((lng) => lng.id == lang)) {
      return languages.find((lng) => lng.id == 'en');
    }
    return languages.find((lng) => lng.id == lang);
  }
}

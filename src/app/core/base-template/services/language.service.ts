import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { languages } from 'src/environments/config';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selectedLang = 'en';

  constructor(private translate: TranslateService, public intlService: IntlService) {
    this.selectedLang = localStorage.getItem('lang') || 'en';
  }

  selectLang(lang: string) {
    if (lang === 'key') {
      this.translate.langs.forEach((ln) => this.translate.resetLang(ln));
    }
    localStorage.setItem('lang', lang);
    let selectedLang = languages.find((lng) => lng.id == lang);
    this.translate.use(lang);
    this.selectedLang = lang;
    (this.intlService as CldrIntlService).localeId = selectedLang.acceptLanguage;
  }

  selectedLangLocale() {
    return languages.find((lng) => lng.id == this.selectedLang).acceptLanguage;
  }
}

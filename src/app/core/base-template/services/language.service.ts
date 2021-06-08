import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, languages } from 'src/environments/config';
import localeSl from '@angular/common/locales/global/sl';
import localeCz from '@angular/common/locales/global/cs';
import localeDe from '@angular/common/locales/global/de';
import localeFr from '@angular/common/locales/global/fr';
import localeIt from '@angular/common/locales/global/it';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { registerLocaleData } from '@angular/common';
import localeSlExtra from '@angular/common/locales/extra/sl';
import localeCzExtra from '@angular/common/locales/extra/cs';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeItExtra from '@angular/common/locales/extra/it';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public selectedLang = 'en';

  constructor(private translate: TranslateService, public intlService: IntlService) {
    this.selectedLang = localStorage.getItem('lang');
  }

  selectLang(lang: string) {
    if (lang === 'key') {
      this.translate.langs.forEach((ln) => this.translate.resetLang(ln));
    }
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.selectedLang = lang;
    (this.intlService as CldrIntlService).localeId = this.getSelectedLang().acceptLanguage;
  }

  getSelectedLang(): Language {
    return languages.find((lng) => lng.id == this.selectedLang);
  }
}

import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, TRANSLATIONS_FORMAT, TRANSLATIONS } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { selectedLocale } from 'src/environments/locale';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { registerLocaleData } from '@angular/common';
import localeSl from '@angular/common/locales/sl';
import localeCz from '@angular/common/locales/cs';
import localeDe from '@angular/common/locales/de';
import localeSlExtra from '@angular/common/locales/extra/sl';
import localeCzExtra from '@angular/common/locales/extra/cs';
import localeDeExtra from '@angular/common/locales/extra/de';
import { UserModule } from './features/users/modules/user.module';
import { CoreModule } from './core/core.module';

registerLocaleData(localeSl, 'sl', localeSlExtra);
registerLocaleData(localeCz, 'cs', localeCzExtra);
registerLocaleData(localeDe, 'de', localeDeExtra);

declare const require;

@NgModule({
  declarations: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: selectedLocale },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
    {
      provide: TRANSLATIONS,
      useFactory: locale => {
        return require(`raw-loader!../assets/i18n/messages.${locale}.xlf`).default;
      },
      deps: [LOCALE_ID]
    },
    I18n,
    Title
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, UserModule, CoreModule.forRoot(), SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

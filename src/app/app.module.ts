import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, TRANSLATIONS_FORMAT, TRANSLATIONS } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { selectedLocale } from 'src/environments/locale';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { registerLocaleData } from '@angular/common';
import localeSl from '@angular/common/locales/sl';
import localeSlExtra from '@angular/common/locales/extra/sl';
import { UserModule } from './features/users/modules/user.module';
import { CoreModule } from './core/core.module';

registerLocaleData(localeSl, 'sl', localeSlExtra);

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
    I18n
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, UserModule, CoreModule.forRoot(), SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

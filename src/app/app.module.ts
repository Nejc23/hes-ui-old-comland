import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './features/users/modules/user.module';
import { CoreModule } from './core/core.module';
import { AppConfigService } from './core/configuration/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
// Load all required data for the sl locale
import localeSl from '@angular/common/locales/global/sl';
import localeCz from '@angular/common/locales/global/cs';
import localeDe from '@angular/common/locales/global/de';
import localeFr from '@angular/common/locales/global/fr';
import localeIt from '@angular/common/locales/global/it';
import localeSlExtra from '@angular/common/locales/extra/sl';
import localeCzExtra from '@angular/common/locales/extra/cs';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeItExtra from '@angular/common/locales/extra/it';
import '@progress/kendo-angular-intl/locales/sl/all';
import '@progress/kendo-angular-intl/locales/cs/all';
import '@progress/kendo-angular-intl/locales/de/all';
import '@progress/kendo-angular-intl/locales/fr/all';
import '@progress/kendo-angular-intl/locales/it/all';
import '@progress/kendo-angular-intl/locales/en-GB/all';
registerLocaleData(localeSl, 'sl', localeSlExtra);
registerLocaleData(localeCz, 'cs', localeCzExtra);
registerLocaleData(localeDe, 'de', localeDeExtra);
registerLocaleData(localeFr, 'fr', localeFrExtra);
registerLocaleData(localeIt, 'it', localeItExtra);
import { LanguageService } from './core/base-template/services/language.service';

declare const require;

/*export function initializeApp(appConfigService: AppConfigService) {
  return (): Promise<any> => {
    return appConfigService.load();
  }
}*/

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UserModule,
    CoreModule.forRoot(),
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateModule,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      // TODO
      // missingTranslationHandler: {
      //   provide: MissingTranslationHandler,
      //   useClass: WordMissingTranslationHandler,
      // },
      extend: true,
      defaultLanguage: 'en'
    })
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}

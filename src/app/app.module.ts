import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeCzExtra from '@angular/common/locales/extra/cs';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeItExtra from '@angular/common/locales/extra/it';
import localeSlExtra from '@angular/common/locales/extra/sl';
import localeCz from '@angular/common/locales/global/cs';
import localeDe from '@angular/common/locales/global/de';
import localeFr from '@angular/common/locales/global/fr';
import localeIt from '@angular/common/locales/global/it';
// Load all required data for the sl locale
import localeSl from '@angular/common/locales/global/sl';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import '@progress/kendo-angular-intl/locales/cs/all';
import '@progress/kendo-angular-intl/locales/de/all';
import '@progress/kendo-angular-intl/locales/en-GB/all';
import '@progress/kendo-angular-intl/locales/fr/all';
import '@progress/kendo-angular-intl/locales/it/all';
import '@progress/kendo-angular-intl/locales/sl/all';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './core/configuration/services/app-config.service';
import { CoreModule } from './core/core.module';
import { UserModule } from './features/users/modules/user.module';
import { SharedModule } from './shared/shared.module';
import { NgxTranslateDebugParser } from 'ngx-translate-debug';
import { ApiModule as TimeOfUseApiModule } from './api/time-of-use/api.module';
import { ApiModule as CryptoLiteUIApiModule } from './api/crypto-lite-ui/api.module';
import { ApiModule as ConcentratorInventory } from './api/concentrator-inventory/api.module';
import { environment } from 'src/environments/environment';
import { AuditLogsComponent } from './features/administration/audit-logs/audit-logs.component';
import { LicenceComponent } from './features/administration/licence/licence.component';
import { ArcGaugeModule } from '@progress/kendo-angular-gauges';

registerLocaleData(localeSl, 'sl', localeSlExtra);
registerLocaleData(localeCz, 'cs', localeCzExtra);
registerLocaleData(localeDe, 'de', localeDeExtra);
registerLocaleData(localeFr, 'fr', localeFrExtra);
registerLocaleData(localeIt, 'it', localeItExtra);

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
  declarations: [AppComponent, AuditLogsComponent, LicenceComponent],
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
    TimeOfUseApiModule.forRoot({ rootUrl: environment.apiUrl }),
    CryptoLiteUIApiModule.forRoot({ rootUrl: environment.apiUrl }),
    ConcentratorInventory.forRoot({ rootUrl: environment.apiUrl }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateModule,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      parser: { provide: TranslateParser, useClass: NgxTranslateDebugParser },
      // TODO
      // missingTranslationHandler: {
      //   provide: MissingTranslationHandler,
      //   useClass: WordMissingTranslationHandler,
      // },
      extend: true,
      defaultLanguage: 'en'
    }),
    ArcGaugeModule
  ],
  exports: [],

  bootstrap: [AppComponent]
})
export class AppModule {}

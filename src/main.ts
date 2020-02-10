import { enableProdMode, LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { selectedLocale } from './environments/locale';

if (environment.production) {
  enableProdMode();
}

// use the require method provided by webpack
declare const require;
// we use the webpack raw-loader to return the content as a string
const translations = require(`raw-loader!./assets/i18n/messages.${selectedLocale}.xlf`).default;

platformBrowserDynamic([{ provide: LOCALE_ID, useValue: selectedLocale }])
  .bootstrapModule(AppModule, {
    providers: [
      { provide: LOCALE_ID, useValue: selectedLocale },
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' }
    ]
  })
  .catch(err => console.error(err));

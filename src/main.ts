//import { selectedLocale } from './environments/locale';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

LicenseManager.setLicenseKey(environment.licenseKey);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic() //[{ provide: LOCALE_ID, useValue: selectedLocale }]
  .bootstrapModule(
    AppModule /*, {
    providers: [
      { provide: LOCALE_ID, useValue: selectedLocale },
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' }
    ]
  }*/
  )
  .catch((err) => console.error(err));

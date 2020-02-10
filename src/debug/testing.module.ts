import { NgModule } from '@angular/core';
import { TranslatePipeMock } from './helpers/translate-pipe-mock.helper';
import { LocaleDatePipeMock } from './helpers/locale-date-pipe-mock.helper';
import { LocaleDecimalPipeMock } from './helpers/locale-decimal-pipe-mock.helper';

@NgModule({
  declarations: [TranslatePipeMock, LocaleDatePipeMock, LocaleDecimalPipeMock]
})
export class LegacyModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdministrationRoutingModule } from './administration-routing.module';
import { VaultAccessComponent } from '../vaultaccess/componentes/vault-access.component';

@NgModule({
  entryComponents: [],
  declarations: [VaultAccessComponent],
  imports: [SharedModule, AdministrationRoutingModule],
  exports: []
})
export class AdministrationModule {}

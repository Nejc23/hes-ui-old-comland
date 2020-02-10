import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from '../components/help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [SharedModule, CommonModule, HelpRoutingModule]
})
export class HelpModule {}

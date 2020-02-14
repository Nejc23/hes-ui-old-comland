import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DdataConcentrratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';

@NgModule({
  entryComponents: [],
  declarations: [DataConcentratorUnitsComponent],
  imports: [SharedModule, DdataConcentrratorUnitsRoutingModule]
})
export class DataConcentratorUnitsModule {}

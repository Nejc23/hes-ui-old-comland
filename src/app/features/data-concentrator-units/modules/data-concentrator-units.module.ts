import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DdataConcentrratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';

@NgModule({
  entryComponents: [],
  declarations: [DataConcentratorUnitsComponent],
  imports: [SharedModule, DdataConcentrratorUnitsRoutingModule, BreadcrumbsModule]
})
export class DataConcentratorUnitsModule {}

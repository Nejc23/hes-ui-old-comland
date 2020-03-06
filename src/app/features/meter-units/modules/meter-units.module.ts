import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { MeterUnitsRoutingModule } from './meter-units-routing.module';
import { MeterUnitsComponent } from '../components/meter-units.component';
import { AgGridModule } from '@ag-grid-community/angular';

@NgModule({
  entryComponents: [],
  declarations: [MeterUnitsComponent],
  imports: [SharedModule, MeterUnitsRoutingModule, BreadcrumbsModule, AgGridModule.withComponents([])]
})
export class MeterUnitsModule {}

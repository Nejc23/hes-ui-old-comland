import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { MeterUnitsRoutingModule } from './meter-units-routing.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { MeterUnitsOverviewComponent } from '../overview/components/meter-units-overview.component';
import { MeterUnitsTypeComponent } from '../types/components/meter-units-type.component';

@NgModule({
  entryComponents: [],
  declarations: [MeterUnitsOverviewComponent, MeterUnitsTypeComponent],
  imports: [SharedModule, MeterUnitsRoutingModule, BreadcrumbsModule, AgGridModule.withComponents([])]
})
export class MeterUnitsModule {}

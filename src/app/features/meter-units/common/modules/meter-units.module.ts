import { AgGridModule } from '@ag-grid-community/angular';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeterUnitDetailsComponent } from '../../details/components/meter-unit-details.component';
import { RegistersChartComponent } from '../../registers/components/chart/registers-chart.component';
import { RegistersColumnChartComponent } from '../../registers/components/chart/registers-column-chart.component';
import { RegistersStatisticsComponent } from '../../registers/components/statistics/registers-statistics.component';
import { ActionFormComponent } from '../../types/components/action-form/components/action-form.component';
import { MeterUnitFilterComponent } from '../../types/components/filter-form/meter-unit-filter.component';
import { GridCellUnitComponent } from '../../registers/components/grid/grid-custom-components/grid-cell-unit.component';
import { MeterUnitsListComponent } from '../../types/components/meter-units-list.component';
import { MeterUnitRegistersComponent } from '../../registers/components/meter-unit-registers.component';
import { RegistersPieChartComponent } from '../../registers/components/chart/registers-pie-chart.component';
import { RegistersGridComponent } from '../../registers/components/grid/registers-grid.component';
import { GridCellDateComponent } from '../../registers/components/grid/grid-custom-components/grid-cell-date.component';
import { AddMeterUnitFormComponent } from '../components/add-mu-form/add-meter-unit-form.component';
import { MeterUnitsRoutingModule } from './meter-units-routing.module';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { EditMeterUnitFormComponent } from '../components/edit-mu-form/edit-meter-unit-form.component';
import { ErrorMessageModalComponent } from '../components/import-devices/error-messages-modal/error-message-modal.component';
import { TouConfigurationImportComponent } from '../components/plc-meter-tou-config-import/tou-configuration-import.component';
import { GridCellProtocolComponent } from '../../types/components/grid-custom-components/grid-cell-protocol.component';
import { ActionButtonsComponent } from '../../types/components/action-buttons/action-buttons.component';

@NgModule({
  entryComponents: [],
  declarations: [
    MeterUnitsListComponent,
    // AllForJobComponent,
    ActionFormComponent,
    MeterUnitFilterComponent,
    MeterUnitRegistersComponent,
    RegistersChartComponent,
    RegistersPieChartComponent,
    RegistersColumnChartComponent,
    RegistersGridComponent,
    RegistersStatisticsComponent,
    GridCellDateComponent,
    MeterUnitDetailsComponent,
    AddMeterUnitFormComponent,
    GridCellUnitComponent,
    EditMeterUnitFormComponent,
    ErrorMessageModalComponent,
    TouConfigurationImportComponent,
    GridCellProtocolComponent,
    ActionButtonsComponent
  ],
  exports: [RegistersColumnChartComponent],
  imports: [
    SharedModule,
    MeterUnitsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([PipesModule, GridCellDateComponent, GridCellUnitComponent, GridCellProtocolComponent]) //    // TODO CLEANUP CHECK
  ]
})
export class MeterUnitsModule {}

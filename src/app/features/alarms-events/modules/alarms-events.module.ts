import { GridCellSourceComponent } from './../alarms/components/grid/grid-cell-source.component';
import { GridCellSeverityComponent } from './../alarms/components/grid/grid-cell-severity.component';
import { GridCellManufacturerComponent } from './../alarms/components/grid/grid-cell-manufacturer.component';
import { SharedModule } from './../../../shared/shared.module';
import { AlarmsEventsRoutingModule } from './../common/modules/alarms-events-routing.module';
import { NgModule } from '@angular/core';
import { AlarmsEventsListComponent } from '../components/alarms-events-list.component';
import { AlarmsComponent } from '../alarms/components/alarms.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { GridCellTimestampComponent } from '../alarms/components/grid/grid-cell-timestamp.component';
import { GridCellSourceTypeComponent } from '../alarms/components/grid/grid-cell-source-type.component';
import { GridCellAlarmProtocolComponent } from '../alarms/components/grid/grid-cell-alarm-protocol.component';

@NgModule({
  entryComponents: [],
  declarations: [
    AlarmsEventsListComponent,
    AlarmsComponent,
    GridCellTimestampComponent,
    GridCellManufacturerComponent,
    GridCellAlarmProtocolComponent,
    GridCellSeverityComponent,
    GridCellSourceComponent,
    GridCellSourceTypeComponent
  ],
  imports: [
    AlarmsEventsRoutingModule,
    SharedModule,
    AgGridModule.withComponents([
      GridCellTimestampComponent,
      GridCellManufacturerComponent,
      GridCellAlarmProtocolComponent,
      GridCellSeverityComponent,
      GridCellSourceComponent,
      GridCellSourceTypeComponent
    ])
  ],
  exports: []
})
export class AlarmsEventsModule {}

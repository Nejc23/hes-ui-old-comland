import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataConcentratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsListComponent } from '../components/data-concentrator-units-list.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { ActionFormComponent } from '../components/action-form/components/action-form.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellMetersComponent } from '../components/grid-custom-components/grid-cell-meters.component';
import { GridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
import { GridCellLastCommunicationComponent } from '../components/grid-custom-components/grid-cell-last-communication.component';
import { GridCellTagsComponent } from '../components/grid-custom-components/grid-cell-tags.component';
import { GridCellIpComponent } from '../components/grid-custom-components/grid-cell-ip.component';
import { GridCellVendorComponent } from '../components/grid-custom-components/grid-cell-vendor.component';
import { GridCellTypeComponent } from '../components/grid-custom-components/grid-cell-type.component';
import { GridCellIdNumberComponent } from '../components/grid-custom-components/grid-cell-id-number.component';
import { GridCellIconComponent } from '../components/grid-custom-components/grid-cell-icon.component';
import { GridCellJobStatusComponent } from '../components/grid-custom-components/grid-cell-job-status.component';
import { DcFilterComponent } from '../components/filter-form/dc-filter.component';
import { DataConcentratorDetailComponent } from '../details/components/data-concentrator-detail.component';
import { GridCellActionsComponent } from '../components/grid-custom-components/grid-cell-actions.component';
import { DcOperationsComponent } from '../components/operations/dc-operations.component';
import { MeterUnitsModule } from '../../meter-units/common/modules/meter-units.module';
import { AlarmsEventsModule } from '../../alarms-events/modules/alarms-events.module';

@NgModule({
  entryComponents: [],
  declarations: [
    DataConcentratorUnitsListComponent,
    DataConcentratorDetailComponent,
    ActionFormComponent,
    GridSelectionHeaderComponent,
    GridCellStatusComponent,
    GridCellReadStatusComponent,
    GridCellMetersComponent,
    GridCellNameComponent,
    GridCellLastCommunicationComponent,
    GridCellTagsComponent,
    GridCellIpComponent,
    GridCellVendorComponent,
    GridCellTypeComponent,
    GridCellIdNumberComponent,
    GridCellIconComponent,
    GridCellJobStatusComponent,
    GridCellActionsComponent,
    DcFilterComponent,
    DcOperationsComponent
  ], // StringifyDataPipe
  imports: [
    SharedModule,
    DataConcentratorUnitsRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([
      GridSelectionHeaderComponent,
      GridCellStatusComponent,
      GridCellReadStatusComponent,
      GridCellMetersComponent,
      GridCellNameComponent,
      GridCellLastCommunicationComponent,
      GridCellTagsComponent,
      GridCellIpComponent,
      GridCellVendorComponent,
      GridCellTypeComponent,
      GridCellIdNumberComponent,
      GridCellIconComponent,
      GridCellJobStatusComponent,
      GridCellActionsComponent
    ]),
    MeterUnitsModule,
    AlarmsEventsModule
  ],
  exports: []
})
export class DataConcentratorUnitsModule {}

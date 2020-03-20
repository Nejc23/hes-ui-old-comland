import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataConcentratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
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
import { GridCustomFilterComponent } from '../components/grid-custom-components/grid-custom-filter.component';
import { GridCellIpComponent } from '../components/grid-custom-components/grid-cell-ip.component';
import { GridCellVendorComponent } from '../components/grid-custom-components/grid-cell-vendor.component';
import { GridCellTypeComponent } from '../components/grid-custom-components/grid-cell-type.component';
import { GridCellIdNumberComponent } from '../components/grid-custom-components/grid-cell-id-number.component';

@NgModule({
  entryComponents: [],
  declarations: [
    DataConcentratorUnitsComponent,
    ActionFormComponent,
    GridSelectionHeaderComponent,
    GridCellStatusComponent,
    GridCellReadStatusComponent,
    GridCellMetersComponent,
    GridCellNameComponent,
    GridCellLastCommunicationComponent,
    GridCellTagsComponent,
    GridCustomFilterComponent,
    GridCellIpComponent,
    GridCellVendorComponent,
    GridCellTypeComponent,
    GridCellIdNumberComponent
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
      GridCustomFilterComponent,
      GridCellIpComponent,
      GridCellVendorComponent,
      GridCellTypeComponent,
      GridCellIdNumberComponent
    ])
  ],
  exports: []
})
export class DataConcentratorUnitsModule {}

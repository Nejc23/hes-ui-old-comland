import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { GridCellAddBtnComponent } from '../auto-template/components/grid-custom-components/grid-cell-add-btn.component';
import { GridCellEditActionsComponent } from '../auto-template/components/grid-custom-components/grid-cell-edit-actions.component';
import { GridRequiredCellEditorComponent } from '../auto-template/components/grid-custom-components/grid-required-cell-editor.component';
import { ImportDeviceKeysComponent } from '../components/import-device-keys/import-device-keys.component';
import { AutoTemplateComponent } from '../auto-template/components/auto-template.component';
import { GridCellRemoveBtnComponent } from '../auto-template/components/grid-custom-components/grid-cell-remove-btn.component';
import { GridCellNextRunNoEventComponent } from '../auto-template/components/grid-custom-components/grid-cell-next-run-no-event.component';
import { ConfigurationsDetailComponent } from '../configurations-detail/configurations-detail.component';
import { ConfigurationsListComponent } from '../configurations-list/configurations-list.component';

@NgModule({
  entryComponents: [],
  declarations: [
    ImportDeviceKeysComponent,
    AutoTemplateComponent,
    GridCellEditActionsComponent,
    GridCellAddBtnComponent,
    GridRequiredCellEditorComponent,
    GridCellRemoveBtnComponent,
    GridCellNextRunNoEventComponent,
    ConfigurationsListComponent,
    ConfigurationsDetailComponent
  ],
  imports: [
    SharedModule,
    ConfigurationRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([
      GridCellEditActionsComponent,
      GridCellNextRunNoEventComponent,
      GridCellRemoveBtnComponent,
      GridCellAddBtnComponent,
      GridRequiredCellEditorComponent
    ])
  ],
  exports: []
})
export class ConfigurationModule {}

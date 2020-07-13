import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { AutoTemplatesComponent } from '../components/auto-templates.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { GridCellAddBtnComponent } from '../components/grid-custom-components/grid-cell-add-btn.component';
import { GridCellEditActionsComponent } from '../components/grid-custom-components/grid-cell-edit-actions.component';
import { GridRequiredCellEditorComponent } from '../components/grid-custom-components/grid-required-cell-editor.component';

@NgModule({
  entryComponents: [],
  declarations: [AutoTemplatesComponent, GridCellEditActionsComponent, GridCellAddBtnComponent, GridRequiredCellEditorComponent],
  imports: [
    SharedModule,
    ConfigurationRoutingModule,
    BreadcrumbsModule,
    AgGridModule.withComponents([GridCellEditActionsComponent, GridCellAddBtnComponent, GridRequiredCellEditorComponent])
  ],
  exports: []
})
export class ConfigurationModule {}

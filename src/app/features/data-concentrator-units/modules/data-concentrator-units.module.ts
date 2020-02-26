import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataConcentratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { ActionFormComponent } from '../components/action-form/components/action-form.component';
import { DxDataGridModule, DxBulletModule, DxTemplateModule, DxTooltipModule, DxTagBoxModule } from 'devextreme-angular';
import { FilterFormComponent } from '../components/action-form/components/filter-form.component';

@NgModule({
  entryComponents: [],
  declarations: [DataConcentratorUnitsComponent, ActionFormComponent, FilterFormComponent], // StringifyDataPipe
  imports: [
    SharedModule,
    DataConcentratorUnitsRoutingModule,
    BreadcrumbsModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    DxTooltipModule,
    DxTagBoxModule
  ]
})
export class DataConcentratorUnitsModule {}

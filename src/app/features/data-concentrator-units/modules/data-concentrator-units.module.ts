import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataConcentratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsComponent, StringifyDataPipe } from '../components/data-concentrator-units.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { ActionFormComponent } from '../components/action-form/action-form.component';
import { DxDataGridModule, DxBulletModule, DxTemplateModule } from 'devextreme-angular';
@NgModule({
  entryComponents: [],
  declarations: [DataConcentratorUnitsComponent, ActionFormComponent, StringifyDataPipe],
  imports: [SharedModule, DataConcentratorUnitsRoutingModule, BreadcrumbsModule, DxDataGridModule, DxBulletModule, DxTemplateModule]
})
export class DataConcentratorUnitsModule {}

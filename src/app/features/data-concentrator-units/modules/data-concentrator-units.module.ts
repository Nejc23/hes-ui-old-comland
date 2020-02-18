import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DdataConcentrratorUnitsRoutingModule } from './data-concentrator-units-routing.module';
import { DataConcentratorUnitsComponent } from '../components/data-concentrator-units.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { ActionFormComponent } from '../components/action-form/action-form.component';
@NgModule({
  entryComponents: [],
  declarations: [DataConcentratorUnitsComponent, ActionFormComponent],
  imports: [SharedModule, DdataConcentrratorUnitsRoutingModule, BreadcrumbsModule, GridModule]
})
export class DataConcentratorUnitsModule {}

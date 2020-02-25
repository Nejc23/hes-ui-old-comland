import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { DxDataGridModule, DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { GridModule } from '@progress/kendo-angular-grid';
import { KendoComponent } from '../components/kendo.component';
import { KendoUIRoutingModule } from './kendo-ui-routing.module';
@NgModule({
  entryComponents: [],
  declarations: [KendoComponent, KendoComponent],
  imports: [SharedModule, KendoUIRoutingModule, BreadcrumbsModule, DxDataGridModule, DxBulletModule, DxTemplateModule, GridModule]
})
export class KendoUIModule {}

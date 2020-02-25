import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { DevextremeComponent } from '../components/devextreme.component';
import { DevextremeRoutingModule } from './devextreme-routing.module';
import { DxDataGridModule, DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { GridModule } from '@progress/kendo-angular-grid';
@NgModule({
  entryComponents: [],
  declarations: [DevextremeComponent],
  imports: [SharedModule, DevextremeRoutingModule, BreadcrumbsModule, DxDataGridModule, DxBulletModule, DxTemplateModule, GridModule]
})
export class DevextremeModule {}

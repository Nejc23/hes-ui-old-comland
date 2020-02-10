import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { SimpleTableComponent } from './components/simple-table.component';
import { TableClientComponent } from './components/table-client.component';
import { TableClientNoSelectionComponent } from './components/table-client-no-selection.component';
import { CustomFormsModule } from '../forms/custom-forms.module';

@NgModule({
  declarations: [SimpleTableComponent, TableClientComponent, TableClientNoSelectionComponent],

  exports: [SimpleTableComponent, TableClientComponent, TableClientNoSelectionComponent, NgxDatatableModule],
  imports: [NgxDatatableModule, CommonModule, CustomFormsModule]
})
export class TableModule {}

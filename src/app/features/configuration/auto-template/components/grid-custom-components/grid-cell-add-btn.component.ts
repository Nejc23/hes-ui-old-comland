import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';

@Component({
  selector: 'app-grid-cell-add-btn',
  templateUrl: './grid-cell-add-btn.component.html'
})
export class GridCellAddBtnComponent implements ICellRendererAngularComp {
  public params: any;
  public label = '';

  constructor() {}

  agInit(params: any): void {
    this.params = params;

    if (params.data.rules) {
      const txt = params.value ? params.value : '-';
      this.label = '(' + params.data.rules.length + ') ' + txt;
    }
  }

  public add() {
    const gridApi = this.params.api as GridApi;
    this.params.context.componentParent.addNewItem(this.params.data.templateId, this.params.node.rowIndex, gridApi);
  }

  refresh(): boolean {
    return false;
  }
}

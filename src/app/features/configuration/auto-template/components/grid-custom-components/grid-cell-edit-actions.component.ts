import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';

@Component({
  selector: 'app-grid-cell-edit-actions',
  templateUrl: './grid-cell-edit-actions.component.html'
})
export class GridCellEditActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;
  public rowIndex = -1;

  constructor() {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.gridApi = this.params.api as GridApi;
    this.rowIndex = params.rowIndex;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  // action edit
  editItem(params: any) {
    this.params.context.componentParent.editForm(this.params.autoTemplateRuleId, this.rowIndex);
  }

  isRowInEditMode() {
    const editingCells = this.gridApi.getEditingCells();
    return editingCells && editingCells.length > 0 ? editingCells[0].rowIndex === this.rowIndex : false;
  }

  // action delete
  deleteItem(params: any) {
    this.params.context.componentParent.deleteForm(params.data.autoTemplateRuleId);
  }

  // action save
  saveItem(params: any) {
    this.params.context.componentParent.saveForm(this.gridApi, params);
  }

  // action cancel
  cancelItem(params: any) {
    const gridApi = this.params.api as GridApi;
    this.params.context.componentParent.cancelForm(gridApi);
  }

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'edit':
        return $localize `Edit rule`;
      case 'delete':
        return $localize `Delete rule`;
      case 'save':
        return $localize `Save`;
      case 'cancel':
        return $localize `Cancel`;
    }
    return '';
  }
}

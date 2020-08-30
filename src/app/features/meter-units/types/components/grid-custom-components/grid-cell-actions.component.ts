import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridApi } from '@ag-grid-community/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp, OnDestroy {
  public params: any;
  public gridApi: GridApi;
  public hideEditDelete = false;
  public isRowMouseOver = false;
  public rowIndex = -1;

  constructor(private i18n: I18n, private cdRef: ChangeDetectorRef) {}

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
    const cellDefs2 = this.gridApi.getEditingCells();
    if (cellDefs2.length === 0) {
      this.gridApi.setFocusedCell(params.rowIndex, 'propertyName');
      this.gridApi.startEditingCell({
        rowIndex: params.rowIndex,
        colKey: 'propertyName'
      });
      const cellDefs = this.gridApi.getEditingCells();
      if (cellDefs.length > 0) {
        this.hideEditDelete = true;
      }
      this.params.context.componentParent.editForm(params.data.autoTemplateRuleId);
    }
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
        return this.i18n('Edit rule');
      case 'delete':
        return this.i18n('Delete rule');
      case 'save':
        return this.i18n('Save');
      case 'cancel':
        return this.i18n('Cancel');
    }
    return '';
  }

  ngOnDestroy() {}
}

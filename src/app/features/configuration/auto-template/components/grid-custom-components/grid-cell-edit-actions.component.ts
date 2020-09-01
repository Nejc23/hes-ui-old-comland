import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridApi } from '@ag-grid-community/core';
import { Subscription } from 'rxjs';
import { AutoTemplatesGridEventEmitterService } from '../../services/auto-template-grid-event-emitter.service';

@Component({
  selector: 'app-grid-cell-edit-actions',
  templateUrl: './grid-cell-edit-actions.component.html'
})
export class GridCellEditActionsComponent implements ICellRendererAngularComp, OnDestroy {
  public params: any;
  public gridApi: GridApi;
  private serviceSubscription: Subscription;
  private serviceSubscriptionRowMouseOver: Subscription;
  private serviceSubscriptionRowMouseOut: Subscription;
  public isRowMouseOver = false;
  public rowIndex = -1;

  constructor(private i18n: I18n, private service: AutoTemplatesGridEventEmitterService, private cdRef: ChangeDetectorRef) {
    this.serviceSubscriptionRowMouseOver = this.service.eventEmitterRowMouseOver.subscribe({
      next: index => {
        if (index === this.rowIndex) {
          this.isRowMouseOver = true;
          this.cdRef.detectChanges();
        } else {
          this.isRowMouseOver = false; // prevent active buttons on multiple rows
          this.cdRef.detectChanges();
        }
      }
    });

    this.serviceSubscriptionRowMouseOut = this.service.eventEmitterRowMouseOut.subscribe({
      next: index => {
        if (index === this.rowIndex) {
          this.isRowMouseOver = false;
          this.cdRef.detectChanges();
        }
      }
    });
  }

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

  ngOnDestroy() {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }

    if (this.serviceSubscriptionRowMouseOver) {
      this.serviceSubscriptionRowMouseOver.unsubscribe();
    }

    if (this.serviceSubscriptionRowMouseOut) {
      this.serviceSubscriptionRowMouseOut.unsubscribe();
    }
  }
}

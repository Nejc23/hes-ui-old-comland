import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridApi } from '@ag-grid-community/core';
import { Subscription } from 'rxjs';
import { AutoTemplatesGridEventEmitterService } from '../../services/auto-template-grid-event-emitter.service';

@Component({
  selector: 'app-grid-cell-remove-btn',
  templateUrl: './grid-cell-remove-btn.component.html'
})
export class GridCellRemoveBtnComponent implements ICellRendererAngularComp, OnDestroy {
  public params: any;
  public gridApi: GridApi;
  public hideEditDelete = false;
  private serviceSubscription: Subscription;
  private serviceSubscriptionRowMouseOver: Subscription;
  private serviceSubscriptionRowMouseOut: Subscription;
  public isRowMouseOver = false;
  public rowIndex = -1;

  constructor(private i18n: I18n, private service: AutoTemplatesGridEventEmitterService, private cdRef: ChangeDetectorRef) {
    // catcht event from master component
    (this.serviceSubscription = this.service.eventEmitterEdit.subscribe({
      next: () => {
        //  read state
        this.hideEditDelete = false;
      }
    })),
      (this.serviceSubscriptionRowMouseOver = this.service.eventEmitterRowMouseOverJobs.subscribe({
        next: index => {
          if (index === this.rowIndex) {
            this.isRowMouseOver = true;
            this.cdRef.detectChanges();
          } else {
            this.isRowMouseOver = false; // prevent active buttons on multiple rows
            this.cdRef.detectChanges();
          }
        }
      }));

    this.serviceSubscriptionRowMouseOut = this.service.eventEmitterRowMouseOutJobs.subscribe({
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

    if (params.data.autoTemplateRuleId === 'new') {
      this.hideEditDelete = true;
    }

    this.rowIndex = params.rowIndex;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  // action delete
  removeItem(params: any) {
    this.params.context.componentParent.removeForm(params.data.autoTemplateRuleId);
  }

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'delete':
        return this.i18n('remove job');
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

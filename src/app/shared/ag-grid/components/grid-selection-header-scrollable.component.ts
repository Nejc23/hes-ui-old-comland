import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridEventEmitterService } from '../services/grid-event-emitter.service';

@Component({
  selector: 'app-grid-selection-header-scrollable',
  templateUrl: './grid-selection-header-scrollable.component.html'
})
export class GridSelectionHeaderScrollableComponent implements IHeaderAngularComp, OnDestroy {
  public params: any;
  public isChecked: false;
  public setIntermediate = false;
  public form: FormGroup;
  private cptSelected = 0;
  private serviceSubscription: Subscription;
  private serviceSubscription2: Subscription;

  isDisabled = false;
  sessionNameForGridState = 'grdStateDCU';

  constructor(
    public fb: FormBuilder,
    private service: GridEventEmitterService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService
  ) {
    this.form = this.createForm();

    // event select all or clear selection
    this.serviceSubscription2 = this.service.eventEmitterSelectDeselectAll.subscribe({
      next: (event: number) => {
        const startRow = this.params.api.getFirstDisplayedRow();
        const endRow = this.params.api.getLastDisplayedRow();

        const selectedAll = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState).isSelectedAll;
        this.isDisabled = selectedAll != null && selectedAll ? selectedAll : false;
        if (selectedAll) {
          // if selected all rows
          for (let i = startRow; i <= endRow; i++) {
            this.params.api.forEachNode((node, ix) => {
              node.setSelected(true);
            });
          }
          this.form.get('checkBox').setValue(true);
        } else if (event === -1) {
          // deselect all
          this.params.api.deselectAll();
          this.form.get('checkBox').setValue(false);
          this.cptSelected = 0;
        }
      }
    });
  }

  // click on check-box in header
  checkHeaderChangedValue() {
    if (this.form.get('checkBox').value) {
      this.setIntermediate = false;
    }

    this.params.api.forEachNode((node) => {
      // if (node.rowIndex >= startRow && node.rowIndex <= endRow) {
      node.setSelected(this.form.get('checkBox').value);
      // }
    });
  }

  agInit(params): void {
    this.params = params;

    const rowCount = this.params.api.getDisplayedRowCount();
    const lastGridIndex = rowCount - 1;
    const currentPage = this.params.api.paginationGetCurrentPage();
    const pageSize = this.params.api.paginationGetPageSize();
    const startPageIndex = currentPage * pageSize;
    let endPageIndex = (currentPage + 1) * pageSize - 1;

    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }

    // Count selected rows
    this.cptSelected = 0;
    for (let i = startPageIndex; i <= endPageIndex; i++) {
      const rowNode = this.params.api.getDisplayedRowAtIndex(i);
      if (rowNode) {
        this.cptSelected += rowNode.selected ? 1 : 0;
      }
    }

    // Check the checkbox if all the rows are selected
    const cptRows = endPageIndex + 1 - startPageIndex;

    if (this.form.get('checkBox').value) {
      this.setIntermediate = false;
    }
    if (this.cptSelected === 0) {
      this.setIntermediate = false;
      this.form.get('checkBox').setValue(false);
    } else if (this.cptSelected && cptRows > this.cptSelected) {
      this.setIntermediate = true;
    } else {
      this.setIntermediate = false;
      this.form.get('checkBox').setValue(true);
    }

    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    this.isDisabled = settings != null && settings.isSelectedAll ? settings.isSelectedAll : false;
  }

  refresh(params: any): boolean {
    return true;
  }

  ngOnDestroy() {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
    if (this.serviceSubscription2) {
      this.serviceSubscription2.unsubscribe();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      ['checkBox']: [false]
    });
  }

  get selectProperty() {
    return 'checkBox';
  }
}

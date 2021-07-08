import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MeterUnitsTypeGridEventEmitterService } from '../../services/meter-units-type-grid-event-emitter.service';

@Component({
  selector: 'app-grid-selection-header',
  templateUrl: './grid-selection-header.component.html'
})
export class GridSelectionHeaderComponent implements IHeaderAngularComp, OnDestroy {
  public params: any;
  public isChecked: false;
  public setIntermediate = false;
  public form: FormGroup;
  private cptSelected = 0;
  private serviceSubscription2: Subscription;
  public isDisabled = false;
  sub: Subscription;

  constructor(public fb: FormBuilder, private service: MeterUnitsTypeGridEventEmitterService) {
    this.form = this.createForm();

    this.sub = this.service.getIsSelectedAll().subscribe((value) => {
      this.isDisabled = value;
    });

    // event select all or clear selection
    this.serviceSubscription2 = this.service.eventEmitterSelectDeselectAll.subscribe({
      next: (event: boolean) => {
        const startRow = this.params.api.getFirstDisplayedRow();
        const endRow = this.params.api.getLastDisplayedRow();

        if (event) {
          // if selected all rows
          for (let i = startRow; i <= endRow; i++) {
            this.params.api.forEachNode((node, ix) => {
              node.setSelected(true);
            });
          }
          this.form.get('checkBox').setValue(true);
        } else {
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

    const startRow = this.params.api.getFirstDisplayedRow();
    const endRow = this.params.api.getLastDisplayedRow();
    this.params.api.forEachNode((node) => {
      if (node.rowIndex >= startRow && node.rowIndex <= endRow) {
        node.setSelected(this.form.get('checkBox').value);
      }
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
  }

  refresh(params: any): boolean {
    return true;
  }

  ngOnDestroy() {
    if (this.serviceSubscription2) {
      this.serviceSubscription2.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
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

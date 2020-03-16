import { Component, OnDestroy } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-grid-selection-header',
  templateUrl: './grid-selection-header.component.html'
})
export class GridSelectionHeaderComponent implements IHeaderAngularComp, OnDestroy {
  public params: any;
  public isChecked: false;
  public setIntermediate = false;
  public form: FormGroup;

  private serviceSubscription: Subscription;
  private serviceSubscription2: Subscription;
  private selected = 0;

  constructor(public fb: FormBuilder, private service: DataConcentratorUnitsGridEventEmitterService) {
    this.form = this.createForm();

    // subscribe on event change check-box in grid-row value
    this.serviceSubscription = this.service.eventEmitter.subscribe({
      next: (event: boolean) => {
        const startRow = this.params.api.getFirstDisplayedRow();
        const endRow = this.params.api.getLastDisplayedRow();
        this.selected = 0;
        this.params.api.forEachNode(node => {
          if (node.rowIndex >= startRow && node.rowIndex <= endRow && node.selected) {
            this.selected++;
          }
        });

        if (this.form.get('checkBox').value) {
          this.setIntermediate = false;
        }
        if (this.selected === 0) {
          this.setIntermediate = false;
          this.form.get('checkBox').setValue(false);
        } else if (this.selected > 0 && this.selected < 20) {
          this.setIntermediate = true;
        } else {
          this.setIntermediate = false;
          this.form.get('checkBox').setValue(true);
        }
      }
    });

    // event page changed & deselect all
    this.serviceSubscription2 = this.service.eventEmitterPageChange.subscribe({
      next: (event: number) => {
        const startRow = this.params.api.getFirstDisplayedRow();
        const endRow = this.params.api.getLastDisplayedRow();
        const selectedAll = localStorage.getItem('lockCheckBox') === 'true' ? true : false;
        if (selectedAll) {
          // if selected all rows
          for (let i = startRow; i <= endRow; i++) {
            this.params.api.forEachNode((node, i) => {
              node.setSelected(true);
            });
          }
          this.form.get('checkBox').setValue(true);
        } else if (event === -1) {
          // deselect all
          this.params.api.deselectAll();
          this.form.get('checkBox').setValue(false);
          this.selected = 0;
        } else {
          // reload check boxes on current page
          this.selected = 0;
          this.params.api.forEachNode((node, i) => {
            if (node.rowIndex >= startRow && node.rowIndex <= endRow && node.selected) {
              this.selected++;
            }
          });

          if (this.form.get('checkBox').value) {
            this.setIntermediate = false;
          }

          if (this.selected === 0) {
            this.setIntermediate = false;
            this.form.get('checkBox').setValue(false);
          } else if (this.selected > 0 && this.selected < 20) {
            this.setIntermediate = true;
          } else {
            this.setIntermediate = false;
            this.form.get('checkBox').setValue(true);
          }
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
    this.params.api.forEachNode(node => {
      if (node.rowIndex >= startRow && node.rowIndex <= endRow) {
        node.setSelected(this.form.get('checkBox').value);
      }
    });
  }

  agInit(params): void {
    this.params = params;
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

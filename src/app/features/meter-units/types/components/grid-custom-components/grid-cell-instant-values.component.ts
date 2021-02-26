import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';

@Component({
  selector: 'app-grid-cell-instant-values',
  templateUrl: './grid-cell-instant-values.component.html'
})
export class GridCellInstantValuesComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst;

  public params: any;

  values: number[] = [];

  isConnectedVisible = false;
  isDisconnectedVisible = false;
  isReadyForActivationVisible = false;

  constructor(private statictextService: MeterUnitsTypeStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
    this.values = this.params?.value?.map((v) => v.value);
    this.values = this.values?.filter((v, i) => {
      return this.values.indexOf(v) === i;
    });

    this.isConnectedVisible = this.values?.some((v) => v === 1);
    this.isReadyForActivationVisible = this.values?.some((v) => v === 2);
    this.isDisconnectedVisible = this.values?.some((v) => v === 0);
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  getValuesCount(value: number) {
    return this.params?.value?.filter((v) => v.value === value)?.length;
  }

  getBadgeClass(selectedValue: number) {
    let badgeClass = 'badge-success';
    if (selectedValue === 0) {
      badgeClass = 'badge-dark';
    } else if (selectedValue === 2) {
      badgeClass = 'badge-info';
    }

    return badgeClass;
  }
}

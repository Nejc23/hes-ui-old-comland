import { InstantValues } from './../../consts/meter-units.consts';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';

@Component({
  selector: 'app-grid-cell-instant-values',
  templateUrl: './grid-cell-instant-values.component.html'
})
export class GridCellInstantValuesComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst;

  instantValues = InstantValues;
  public params: any;

  values: string[] = [];
  filteredData: any;

  isConnectedVisible = false;
  isDisconnectedVisible = false;
  isReadyForReconnectionVisible = false;

  constructor(private statictextService: MeterUnitsTypeStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;

    this.filteredData = this.params.value.filter((value) => value.registerType === 'RELAY_CONTROL_STATE');
    if (this.filteredData) {
      const valuesTmp = this.filteredData.map((v) => v.value);
      this.values = valuesTmp?.filter((v, i) => {
        return valuesTmp.indexOf(v) === i;
      });
      this.isConnectedVisible = this.values?.some((v) => v === InstantValues.connected);
      this.isReadyForReconnectionVisible = this.values?.some((v) => v === InstantValues.readyForConnection);
      this.isDisconnectedVisible = this.values?.some((v) => v === InstantValues.disconnected);
    }
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  getValuesCount(value: number) {
    return this.filteredData?.filter((v) => v.value === value)?.length;
  }

  getBadgeClass(selectedValue: string) {
    var classes = {
      '0': 'badge-dark',
      '1': 'badge-success',
      '2': 'badge-info'
    };

    return classes[selectedValue];
  }

  areValuesEmpty() {
    return !this.params.value || this.filteredData.length === 0;
  }
}

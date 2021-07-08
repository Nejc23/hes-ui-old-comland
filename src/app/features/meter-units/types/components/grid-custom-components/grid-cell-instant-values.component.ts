import { DisconnectorStateEnum, InstantValues } from '../../consts/meter-units.consts';
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
  disconnectorStateEnum = Object.values(DisconnectorStateEnum);

  constructor(private statictextService: MeterUnitsTypeStaticTextService) {}

  agInit(params: any): void {
    this.params = params;
    this.filteredData = this.params.value.filter((value) => value.registerType === 'RELAY_CONTROL_STATE');
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  getValuesCount(type: DisconnectorStateEnum) {
    return this.filteredData.filter((data) => data.interpretedValue?.toLowerCase() === type.toLowerCase()).length;
  }

  getDataByType(type: string) {
    return this.filteredData.filter((data) => data.interpretedValue?.toLowerCase() === type.toLowerCase());
  }

  getClass(type: DisconnectorStateEnum) {
    switch (type) {
      case DisconnectorStateEnum.CONNECTED:
        return 'badge-success';
      case DisconnectorStateEnum.READY:
        return 'badge-info';
      default:
        return 'badge-dark';
    }
  }

  areValuesEmpty() {
    return this.filteredData.length === 0;
  }
}

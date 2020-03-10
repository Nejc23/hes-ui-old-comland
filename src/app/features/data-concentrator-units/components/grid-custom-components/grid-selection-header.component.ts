import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';

@Component({
  selector: 'app-grid-selection-header',
  templateUrl: './grid-selection-header.component.html'
})
export class GridSelectionHeaderComponent implements IHeaderAngularComp {
  public params: any;
  public isChecked: false;

  constructor(private service: DataConcentratorUnitsGridEventEmitterService) {}

  agInit(params): void {
    this.params = params;
  }

  checkValue(event: any) {
    this.service.checkChanged(event);
  }
}

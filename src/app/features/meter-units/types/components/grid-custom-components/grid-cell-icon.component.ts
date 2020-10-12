import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';

@Component({
  selector: 'app-grid-cell-icon',
  templateUrl: './grid-cell-icon.component.html'
})
export class GridCellIconComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private staticextService: MeterUnitsTypeStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticextService.nextPlannedReadText + $localize`${moment(time).fromNow()}`;
  }
}

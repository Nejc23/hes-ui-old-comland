import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';
import { JobsStaticTextService } from '../../services/jobs-static-text.service';

@Component({
  selector: 'app-grid-cell-next-run',
  templateUrl: './grid-cell-next-run.component.html'
})
export class GridCellNextRunComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private staticextService: JobsStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  setNextReadText(time: string) {
    return $localize`${time ? moment(time).fromNow() : this.staticextService.notAvailableTekst}`;
  }
}

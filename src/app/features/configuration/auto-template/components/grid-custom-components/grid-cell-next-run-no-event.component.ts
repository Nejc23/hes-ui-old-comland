import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-next-run-no-event',
  templateUrl: './grid-cell-next-run-no-event.component.html'
})
export class GridCellNextRunNoEventComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private translate: TranslateService) {}

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
    return `${time ? moment(time).fromNow() : this.translate.instant('COMMON.NA')}`;
  }
}

import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { AutoTemplatesStaticTextService } from '../../services/auto-template-static-text.service';

@Component({
  selector: 'app-grid-cell-next-run-no-event',
  templateUrl: './grid-cell-next-run-no-event.component.html'
})
export class GridCellNextRunNoEventComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private i18n: I18n, private staticextService: AutoTemplatesStaticTextService) {}

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
    return this.i18n(time ? moment(time).fromNow() : this.staticextService.notAvailableTekst);
  }
}

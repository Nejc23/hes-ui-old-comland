import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';

@Component({
  selector: 'app-grid-cell-detail-link',
  templateUrl: './grid-cell-detail-link.component.html'
})
export class GridCellDetailLinkComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private statictextService: MeterUnitsTypeStaticTextService, private i18n: I18n) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  // action show details
  showItem() {
    this.params.context.showItem(this.params.data.deviceId);
  }
}

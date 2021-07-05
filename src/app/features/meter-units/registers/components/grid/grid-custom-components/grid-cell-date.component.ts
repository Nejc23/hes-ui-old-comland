import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-date',
  templateUrl: './grid-cell-date.component.html'
})
export class GridCellDateComponent implements ICellRendererAngularComp {
  notAvailableText = this.translate.instant('COMMON.NA');
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
}

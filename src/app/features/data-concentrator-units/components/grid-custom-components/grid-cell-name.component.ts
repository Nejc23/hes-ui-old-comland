import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-cell-name',
  templateUrl: './grid-cell-name.component.html'
})
export class GridCellNameComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private router: Router) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  toDetails() {
    this.router.navigate(['dataConcentratorUnits/' + this.params.data.concentratorId]);
  }
}

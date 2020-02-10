import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DashboardGridState } from '../../interfaces/dashboard-grid-state.interface';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit {
  @Input() gridState: DashboardGridState;
  @Input() isEditMode: boolean;

  constructor() {}

  ngOnInit() {}

  get options() {
    return this.gridState.options;
  }

  get dashboard() {
    return this.gridState.dashboard;
  }
}

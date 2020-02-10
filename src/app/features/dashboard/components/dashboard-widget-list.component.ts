import { Component, OnInit, Input } from '@angular/core';
import { DashboardListWidget } from '../interfaces/dashboard-list-widget.interface';
import { DashboardStoreService } from '../services/dashboard-store.service';
import { DashboardState } from '../interfaces/dashboard-state.interface';
import { Guid } from 'src/app/shared/utils/services/guid.service';

@Component({
  selector: 'app-dashboard-widget-list',
  templateUrl: './dashboard-widget-list.component.html'
})
export class DashboardWidgetListComponent implements OnInit {
  @Input() state: DashboardState;

  constructor(private dashboardStore: DashboardStoreService) {}

  ngOnInit() {}

  onClick(widget: DashboardListWidget) {
    widget.gridItem.id = Guid.newGuid().toString();
    this.dashboardStore.addGridItem(widget.gridItem);
  }

  getWidgets(state: DashboardState): DashboardListWidget[] {
    return state.listWidgets;
  }
}

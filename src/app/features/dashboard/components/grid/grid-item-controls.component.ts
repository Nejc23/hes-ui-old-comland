import { Component, OnInit, Input } from '@angular/core';
import { DashboardGridItem } from '../../interfaces/dashboard-grid-item.interface';
import { DashboardGridService } from '../../services/dashboard-grid.service';

@Component({
  selector: 'app-grid-item-controls',
  templateUrl: './grid-item-controls.component.html'
})
export class GridItemControlsComponent implements OnInit {
  @Input() item: DashboardGridItem;

  constructor(private gridService: DashboardGridService) {}

  ngOnInit() {}

  onDeleteClick() {
    this.gridService.removeItemFromGrid(this.item.id);
  }

  onSettingsClick() {
    this.gridService.openWidgetSettings(this.item.id, this.item.widgetType);
  }
}

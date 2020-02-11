import { DashboardListWidget } from 'src/app/features/dashboard/interfaces/dashboard-list-widget.interface';
import { GridItemContent } from 'src/app/features/dashboard/interfaces/grid-item-content.interface';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';

export interface WidgetAccess {
  getListWidget(): DashboardListWidget;
  getSettingsModalComponent(): any;
  getSettingsFormComponent(): any;
  getGridWidgetComponent(): any;
  getContent(): GridItemContent;
  getReadings(): DashboardItemDataResponse;
}

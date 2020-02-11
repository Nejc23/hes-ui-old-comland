import { GridItemContent } from 'src/app/features/dashboard/interfaces/grid-item-content.interface';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';

export interface GridWidgetAccess {
  content: GridItemContent;
  readings: DashboardItemDataResponse;
  id: string;
}

import { GridsterItem } from 'angular-gridster2';
import { GridItemContent } from './grid-item-content.interface';
import { WidgetType } from '../../widgets/enums/widget-type.enum';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';
import { DashboardGridItemPropertyResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-grid-response.interface';

export interface DashboardGridItem extends GridsterItem {
  widgetType: WidgetType;
  id: string;
  content: GridItemContent;
  readings: DashboardItemDataResponse;
  properties: DashboardGridItemPropertyResponse;
}

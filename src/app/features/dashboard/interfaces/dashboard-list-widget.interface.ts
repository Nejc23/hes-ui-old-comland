import { DashboardGridItem } from './dashboard-grid-item.interface';
import { WidgetType } from '../../widgets/enums/widget-type.enum';

export interface DashboardListWidget {
  description: string;
  name: string;
  iconClass: string;
  widgetType: WidgetType;
  gridItem: DashboardGridItem;
  disabled: boolean;
  licenseName: string;
}

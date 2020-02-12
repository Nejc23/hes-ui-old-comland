import { DashboardListWidget } from '../../../features/dashboard/interfaces/dashboard-list-widget.interface';
import { WidgetType } from '../enums/widget-type.enum';
import { DashboardGridItem } from '../../../features/dashboard/interfaces/dashboard-grid-item.interface';
import { WidgetIcon } from '../enums/widget-icon.enum';

export class CurrentListWidget implements DashboardListWidget {
  description: string;
  iconClass: string;
  widgetType: WidgetType;
  name: string;
  disabled: boolean;
  licenseName: string;

  gridItem: DashboardGridItem = {
    x: 0,
    y: 0,
    widgetType: WidgetType.current,
    cols: 1,
    rows: 1,
    id: '',
    content: {
      iconClass: WidgetIcon.current,
      itemTitle: $localize`Current`
    },
    readings: null,
    properties: null
  };

  constructor() {
    this.description = $localize`Description current`;
    this.iconClass = WidgetIcon.current;
    this.widgetType = WidgetType.current;
    this.name = $localize`Current`;
    this.disabled = false;
    this.licenseName = '';
  }
}

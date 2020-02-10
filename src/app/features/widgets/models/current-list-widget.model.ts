import { DashboardListWidget } from '../../../features/dashboard/interfaces/dashboard-list-widget.interface';
import { WidgetType } from '../enums/widget-type.enum';
import { I18n } from '@ngx-translate/i18n-polyfill';
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
      itemTitle: this.i18n('Current')
    },
    readings: null,
    properties: null
  };

  constructor(private i18n: I18n) {
    this.description = this.i18n('Description current');
    this.iconClass = WidgetIcon.current;
    this.widgetType = WidgetType.current;
    this.name = this.i18n('Current');
    this.disabled = false;
    this.licenseName = '';
  }
}

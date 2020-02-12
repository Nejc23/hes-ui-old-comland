import { BaseWidget } from './base-widget.helper';
import { DefaultWidgetSettingComponent } from 'src/app/shared/modals/components/widget-settings/default-widget-setting.component';
import { DashboardListWidget } from 'src/app/features/dashboard/interfaces/dashboard-list-widget.interface';
import { GridItemContent } from 'src/app/features/dashboard/interfaces/grid-item-content.interface';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';

export class CurrentWidget extends BaseWidget {
  constructor(
    protected listWidget: DashboardListWidget,
    protected settingsFormComponent: any,
    protected gridWidgetComponent: any,
    protected gridItemContent: GridItemContent,
    protected readings: DashboardItemDataResponse
  ) {
    super(listWidget, settingsFormComponent, gridWidgetComponent, gridItemContent, readings);
  }

  getSettingsModalComponent() {
    return DefaultWidgetSettingComponent;
  }

  getSettingsFormComponent() {
    return this.settingsFormComponent;
  }
}

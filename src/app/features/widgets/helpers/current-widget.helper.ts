import { BaseWidget } from './base-widget.helper';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DefaultWidgetSettingComponent } from 'src/app/shared/modals/components/widget-settings/default-widget-setting.component';
import { DashboardListWidget } from 'src/app/features/dashboard/interfaces/dashboard-list-widget.interface';
import { GridItemContent } from 'src/app/features/dashboard/interfaces/grid-item-content.interface';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';

export class CurrentWidget extends BaseWidget {
  constructor(
    protected listWidget: DashboardListWidget,
    protected i18n: I18n,
    protected settingsFormComponent: any,
    protected gridWidgetComponent: any,
    protected gridItemContent: GridItemContent,
    protected readings: DashboardItemDataResponse
  ) {
    super(listWidget, i18n, settingsFormComponent, gridWidgetComponent, gridItemContent, readings);
  }

  getSettingsModalComponent() {
    return DefaultWidgetSettingComponent;
  }

  getSettingsFormComponent() {
    return this.settingsFormComponent;
  }
}

import { I18n } from '@ngx-translate/i18n-polyfill';
import { WidgetAccess } from '../interfaces/widget-access.interface';
import { DashboardListWidget } from 'src/app/features/dashboard/interfaces/dashboard-list-widget.interface';
import { GridItemContent } from 'src/app/features/dashboard/interfaces/grid-item-content.interface';
import { DashboardGridItemResponse } from 'src/app/shared/repository/interfaces/responses/dashboard-grid-response.interface';
import { DashboardItemDataResponse } from 'src/app/shared/repository/interfaces/responses/dashboard-item-data-response.interface';

export abstract class BaseWidget implements WidgetAccess {
  constructor(
    protected listWidget: DashboardListWidget,
    protected i18n: I18n,
    protected settingsFormComponent: any, // component
    protected gridWidgetComponent: any,
    protected gridItemContent: GridItemContent,
    protected readings: DashboardItemDataResponse
  ) {}

  getListWidget() {
    return this.listWidget;
  }

  getGridWidgetComponent() {
    return this.gridWidgetComponent;
  }

  getContent() {
    return this.gridItemContent;
  }

  getReadings() {
    return this.readings;
  }

  abstract getSettingsModalComponent();

  abstract getSettingsFormComponent();
}

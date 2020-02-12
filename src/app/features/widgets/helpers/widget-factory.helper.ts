import * as _ from 'lodash';
import { WidgetType } from '../enums/widget-type.enum';
import { WidgetAccess } from '../interfaces/widget-access.interface';
import { DashboardListWidget } from 'src/app/features/dashboard/interfaces/dashboard-list-widget.interface';
import { DefaultSettingsFormComponent } from 'src/app/shared/modals/components/widget-settings/default-form/default-settings-form.component';
import { CurrentWidget } from './current-widget.helper';
import { CurrentListWidget } from '../models/current-list-widget.model';
import { GridWidgetCurrentComponent } from '../components/grid-widget-current/grid-widget-current.component';
import { WidgetIcon } from '../enums/widget-icon.enum';

export class WidgetFactory {
  readonly widgets = {
    [WidgetType.current]: () =>
      new CurrentWidget(
        new CurrentListWidget(),
        DefaultSettingsFormComponent,
        GridWidgetCurrentComponent,
        this.getGridItemContent(WidgetType.current),
        null
      )
  };

  constructor() {}

  getWidget(widgetType: WidgetType): WidgetAccess {
    return this.widgets[widgetType]();
  }

  getListWidgets(): DashboardListWidget[] {
    return _.map(this.widgets, x => x().getListWidget());
  }

  protected getGridItemContent(widgetType: WidgetType) {
    const content = {
      [WidgetType.current]: { iconClass: WidgetIcon.current, itemTitle: 'Current' }
    };
    const result = content[widgetType];
    if (!result) {
      throw new Error($localize`Content for widget type ${widgetType} not supported. Please implement it`);
    }
    return result;
  }
}

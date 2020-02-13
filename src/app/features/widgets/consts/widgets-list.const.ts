import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { WidgetType } from '../enums/widget-type.enum';
import { WidgetIcon } from '../enums/widget-icon.enum';
import { DashboardListWidgetsResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-list-widgets-response.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';

export class WidgetsList {
  constructor(private i18n: I18n) {}
  widgetsData: DashboardListWidgetsResponse = {
    widgets: [
      {
        cols: 1,
        rows: 2,
        widgetType: WidgetType.current,
        icon: WidgetIcon.current,
        maxGraphValue: 300,
        minGraphValue: 0,
        lineColor: 'rgba(68,164,48, 1)',
        lineDash: 'dot',
        showThresholdBackgroundColor: false,
        thresholdWarnigBackgroundColorRGBA: 'rgba(245, 234, 22, 0.2)',
        thresholdErrorBackgroundColorRGBA: 'rgba(217, 33, 57, 0.2)',
        thresholdOkBackgroundColorRGBA: 'rgba(247, 247, 247, 0.2)',
        thresholdCompareDecrease: false,
        showAreaColor: false,
        areaColorRGBA: 'rgba(254,183,70, 0.2)',
        plotBgColor: 'rgb(247, 247, 247)',
        yAxisdTick: 50,
        title: this.i18n(`Current`)
      }
    ]
  };

  getAllWidgets(): Observable<DashboardListWidgetsResponse> {
    return of(null).pipe(flatMap(() => of(this.widgetsData)));
  }
}

import { WidgetType } from 'src/app/features/widgets/enums/widget-type.enum';

export interface DashboardListWidgetsResponse {
  widgets: Widget[];
}

interface Widget {
  cols: number;
  rows: number;
  widgetType: WidgetType;
  icon?: string;
  minGraphValue?: number;
  maxGraphValue?: number;
  statusDescription?: string;

  lineColor?: string;
  lineDash?: string;
  lineTraceName?: string;
  showThresholdBackgroundColor?: boolean;
  thresholdWarnigBackgroundColorRGBA?: string;
  thresholdErrorBackgroundColorRGBA?: string;
  thresholdOkBackgroundColorRGBA?: string;
  thresholdCompareDecrease?: boolean;

  yAxisdTick?: number;
  showAreaColor?: boolean;
  areaColorRGBA?: string;
  plotBgColor?: string;
  title: string;
}

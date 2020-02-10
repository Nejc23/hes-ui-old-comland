import { WidgetType } from '../../enums/widget-type.enum';

export interface StatusWidgetContent {
  thresholdWarningValue?: number;
  thresholdAlarmValue?: number;
  unit: string;
  value: number;
  degree?: number;
  widgetType: WidgetType;
}

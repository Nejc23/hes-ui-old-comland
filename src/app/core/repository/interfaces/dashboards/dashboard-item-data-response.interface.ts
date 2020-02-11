import { RequiredWidgetContent } from 'src/app/features/widgets/interfaces/widget-content/required-widget-content';
import { StatusWidgetContent } from 'src/app/features/widgets/interfaces/widget-content/status-widget-content';

export interface DashboardItemDataResponse extends RequiredWidgetContent {
  id: string;
  value?: number;
  unit?: string;
  degree?: number;
  thresholdWarningValue?: number;
  thresholdAlarmValue?: number;
  graphValues?: any; // for graphs
  historyValues?: any; // for history data
  predictionValues?: any; // for predications data
  pictureValues?: string[]; // for images
  mapDevicesValues?: any; // for devices on map data
  mapPowerlinesValues?: any; // for powerlines on map data
  statusValues?: StatusWidgetContent[]; // for multiple items status
  suggestedDeicingCurrentValue?: number; // icing
  suggestedDeicingCurrentUnit?: string; // icing
}

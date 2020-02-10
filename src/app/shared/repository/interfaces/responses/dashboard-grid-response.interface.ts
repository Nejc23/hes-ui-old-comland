import { WidgetType } from 'src/app/features/widgets/enums/widget-type.enum';

export interface DashboardGridResponse {
  items: DashboardGridItemResponse[];
  refreshIntervalActive: boolean;
}

export interface DashboardGridItemResponse {
  id: string;
  widgetType: WidgetType;
  cols: number;
  rows: number;
  x: number;
  y: number;
  properties: DashboardGridItemPropertyResponse;
}

export interface DashboardGridItemPropertyResponse {
  powerline: number;
  device: number;
  displaySuggestedDeicingCurrent?: boolean; // extra for icing
  displayGraph?: boolean; // all widgets
  displayPrediction?: boolean; // extra amapcitiy
  displayHistory?: boolean; // extra for amapcity
  pictureSizeId?: number; // for image  id:1=1x1, id:2=2x2
  mapSizeId?: number; // for map    id:1=3x2, id:2=3x3, id:3=4x3, id:4=6x3, id:5=6x4, id:6=6x6
  livePhoto?: boolean; // for images (true or false)
}

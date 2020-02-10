import {
  DashboardGridResponse,
  DashboardGridItemPropertyResponse
} from 'src/app/shared/repository/interfaces/responses/dashboard-grid-response.interface';
import { WidgetType } from 'src/app/features/widgets/enums/widget-type.enum';

const propertiesDefaultGraphFalse: DashboardGridItemPropertyResponse = {
  powerline: 1,
  device: 1,
  displayGraph: false
};
export const dashboardGridResponse: DashboardGridResponse = {
  items: [
    {
      cols: 1,
      rows: 1,
      widgetType: WidgetType.current,
      x: 3,
      y: 4,
      id: 'f7101506-60a3-4973-b833-675544w26',
      properties: propertiesDefaultGraphFalse
    }
  ],
  refreshIntervalActive: true
};

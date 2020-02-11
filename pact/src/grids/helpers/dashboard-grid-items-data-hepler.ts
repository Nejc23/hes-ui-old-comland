import * as moment from 'moment';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';

export const responseDashboardData: DashboardItemDataResponse[] = [
  // current without graph
  {
    id: 'f7101506-60a3-4973-b833-675544w26',
    value: 256,
    deviceName: 'Device #1513',
    powerlineName: 'PW7',
    lastUpdateTimestamp: moment().format(),
    unit: 'A'
  }
];

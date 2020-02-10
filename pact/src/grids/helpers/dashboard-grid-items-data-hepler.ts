import { DashboardItemDataResponse } from 'src/app/shared/repository/interfaces/responses/dashboard-item-data-response.interface';
import * as moment from 'moment';

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

import { GridRequestParams } from '../helpers/grid-request-params.interface';
import { GridResponse } from '../helpers/grid-response.interface';

export interface RequestMeterUnitsForJob extends GridRequestParams {
  scheduleId: string;
}

export interface ResponseMeterUnitsForJob {
  jobDescription: string;
  grid: GridResponse<MeterUnitForJob>;
}

export interface MeterUnitForJob {
  deviceId: string;
  name: string;
  vendor: string;
  serialNumber: string;
  protocol: string;
}

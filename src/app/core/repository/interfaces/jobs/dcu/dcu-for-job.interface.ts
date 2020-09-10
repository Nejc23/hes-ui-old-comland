import { GridRequestParams } from '../../helpers/grid-request-params.interface';
import { GridResponse } from '../../helpers/grid-response.interface';

export interface RequestDcuForJob extends GridRequestParams {
  scheduleId: string;
}

export interface ResponseDcuForJob {
  jobDescription: string;
  grid: GridResponse<DcuForJob>;
}

export interface DcuForJob {
  id: string;
  name: string;
  vendor: string;
}

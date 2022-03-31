/* tslint:disable */
/* eslint-disable */
import { RegisterGroupType } from './register-group-type';
export interface InstantRegisterRequest {
  attemptId: string;
  deviceIds: Array<string>;
  endTime: string;
  externalCorrelationId?: null | string;
  groupTypes?: null | Array<RegisterGroupType>;
  registerIds: Array<string>;
  requestId: string;
  startTime: string;
  tenantId?: string;
}

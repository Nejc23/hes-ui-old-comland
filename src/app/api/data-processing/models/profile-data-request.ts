/* tslint:disable */
/* eslint-disable */
import { EventType } from './event-type';
import { InitiatorEnum } from './initiator-enum';
import { ProfileRequest } from './profile-request';
import { RegisterGroupType } from './register-group-type';
export interface ProfileDataRequest {
  attemptId: string;
  deviceIds: Array<string>;
  endTime: string;
  eventType?: EventType;
  externalCorrelationId?: null | string;
  groupTypes?: null | Array<RegisterGroupType>;
  initiatorFilter?: InitiatorEnum;
  profileGroupTypes?: null | Array<RegisterGroupType>;
  profiles?: null | Array<ProfileRequest>;
  registerIds?: null | Array<string>;
  requestId: string;
  startTime: string;
  tenantId?: string;
}

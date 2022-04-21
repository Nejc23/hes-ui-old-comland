/* tslint:disable */
/* eslint-disable */
import { DeviceProtocol } from './device-protocol';
import { MeterVendorType } from './meter-vendor-type';
export interface EventDataRequest {
  endTime: string;
  manufacturer?: MeterVendorType;
  pageNumber: number;
  pageSize: number;
  protocol?: DeviceProtocol;
  requestId: string;
  searchInput?: null | string;
  wildCardsSearch: boolean;
  sortBy?: null | string;
  sortDir?: null | string;
  startTime: string;
  tenantId?: string;
  eventIds?: [];
  rawEventIds?: [];
}

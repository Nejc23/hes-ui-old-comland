/* tslint:disable */
/* eslint-disable */
export interface EventData {
  totalRowCount: number;
  events: EventDataDto[];
}

export interface EventDataDto {
  timeStamp: string;
  eventIdRaw: number;
  eventId?: null | number;
  description?: null | string;
  serialNumber: string;
  manufacturer: string;
  protocol: string;
}

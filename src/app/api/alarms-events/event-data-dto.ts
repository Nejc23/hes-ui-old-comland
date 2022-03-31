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
  manufacturer: MeterVendorType;
  protocol: DeviceProtocol;
}

export enum MeterVendorType {
  UNKNOWN,
  LGZ,
  ISK,
  ESR, //ENSOR
  ELS,
  SAG,
  KAM, //KAMSTRUP
  SMX,
  LYE
}

export enum DeviceProtocol {
  UNKNOWN = 'UNKNOWN',
  G3PLC = 'G3-PLC',
  DLMS = 'DLMS',
  MM_BUS = 'MM BUS'
}

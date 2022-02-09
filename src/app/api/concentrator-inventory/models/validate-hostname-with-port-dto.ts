/* tslint:disable */
/* eslint-disable */
import { DlmsInterfaceType } from './dlms-interface-type';
export interface ValidateHostnameWithPortDto {
  deviceId?: null | string;
  hostname?: null | string;
  interfaceType?: DlmsInterfaceType;
  port?: null | number;
}

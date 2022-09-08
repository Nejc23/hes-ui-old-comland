/* tslint:disable */
/* eslint-disable */
import { AlarmSeverity } from './alarm-severity';
import { AlarmSource } from './alarm-source';
import { DeviceProtocol } from './device-protocol';
import { MeterVendorType } from './meter-vendor-type';
import { NotificationAddressType } from './notification-address-type';
export interface AlarmNotificationFilterDto {
  alarmIds?: null | Array<number>;
  manufacturers?: null | Array<MeterVendorType>;
  notificationAddressType?: NotificationAddressType;
  protocols?: null | Array<DeviceProtocol>;
  severities?: null | Array<AlarmSeverity>;
  sources?: null | Array<AlarmSource>;
}

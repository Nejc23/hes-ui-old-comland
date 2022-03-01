/* tslint:disable */
/* eslint-disable */
import { AdvancedInformation } from './advanced-information';
import { DeviceDriver } from './device-driver';
import { DeviceMedium } from './device-medium';
import { DeviceMetaDataEntity } from './device-meta-data-entity';
import { DeviceState } from './device-state';
import { DlmsInterfaceType } from './dlms-interface-type';
import { HdlcInformation } from './hdlc-information';
import { MeterVendorType } from './meter-vendor-type';
import { ReferencingType } from './referencing-type';
import { WrapperInformation } from './wrapper-information';
export interface MeterData {
  advancedInformation?: AdvancedInformation;
  driver?: DeviceDriver;
  externalId?: null | string;
  hdlcInformation?: HdlcInformation;
  hostname?: null | string;
  interfaceType?: DlmsInterfaceType;
  jobIds?: null | Array<string>;
  manufacturer?: MeterVendorType;
  medium?: DeviceMedium;
  metadata?: null | Array<DeviceMetaDataEntity>;
  name?: null | string;
  parentId?: null | string;
  port?: null | number;
  referencingType?: ReferencingType;
  requestId?: string;
  serialNumber?: null | string;
  state?: DeviceState;
  templateId?: null | string;
  wrapperInformation?: WrapperInformation;
}

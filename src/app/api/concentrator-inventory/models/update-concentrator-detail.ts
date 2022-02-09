/* tslint:disable */
/* eslint-disable */
import { DeviceState } from './device-state';
export interface UpdateConcentratorDetail {
  address?: null | string;
  concentratorId?: null | string;
  externalId?: null | string;
  hostname?: null | string;
  latitude?: null | number;
  longitude?: null | number;
  name?: null | string;
  port?: null | number;
  serialNumber?: null | string;
  state?: DeviceState;
  username?: null | string;
}

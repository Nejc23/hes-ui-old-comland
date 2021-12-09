/* tslint:disable */
/* eslint-disable */
import { ConfigurationState } from './configuration-state';
export interface ConfigurationBasicDto {
  createdBy?: null | string;
  description: string;
  externalId: string;
  id?: string;
  modified?: string;
  state?: ConfigurationState;
}

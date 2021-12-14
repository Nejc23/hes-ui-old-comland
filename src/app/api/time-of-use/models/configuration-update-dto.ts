/* tslint:disable */
/* eslint-disable */
import { ConfigurationState } from './configuration-state';
export interface ConfigurationUpdateDto {
  activation?: null | string;
  description: string;
  externalId: string;
  state: ConfigurationState;
}

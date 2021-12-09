/* tslint:disable */
/* eslint-disable */
import { ConfigurationSourceType } from './configuration-source-type';
import { ConfigurationState } from './configuration-state';
import { DayDetailDto } from './day-detail-dto';
import { SeasonDetailDto } from './season-detail-dto';
import { SpecialDayDetailDto } from './special-day-detail-dto';
import { WeekDetailDto } from './week-detail-dto';
export interface ConfigurationDetailDto {
  activation?: null | string;
  created?: string;
  createdBy?: null | string;
  days?: null | Array<DayDetailDto>;
  description: string;
  externalId: string;
  id?: string;
  modified?: string;
  modifiedBy?: null | string;
  seasons?: null | Array<SeasonDetailDto>;
  sourceType?: ConfigurationSourceType;
  specialDays?: null | Array<SpecialDayDetailDto>;
  state?: ConfigurationState;
  weeks?: null | Array<WeekDetailDto>;
}

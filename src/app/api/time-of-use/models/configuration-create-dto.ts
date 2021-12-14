/* tslint:disable */
/* eslint-disable */
import { DayConfigCreateDto } from './day-config-create-dto';
import { SeasonConfigCreateDto } from './season-config-create-dto';
import { SpecialDayConfigCreateDto } from './special-day-config-create-dto';
import { WeekConfigCreateDto } from './week-config-create-dto';
export interface ConfigurationCreateDto {
  activation?: null | string;
  days?: null | Array<DayConfigCreateDto>;
  description: string;
  externalId: string;
  seasons?: null | Array<SeasonConfigCreateDto>;
  specialDays?: null | Array<SpecialDayConfigCreateDto>;
  weeks?: null | Array<WeekConfigCreateDto>;
}

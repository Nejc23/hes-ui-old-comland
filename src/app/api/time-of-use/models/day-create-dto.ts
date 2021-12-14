/* tslint:disable */
/* eslint-disable */
import { DayActionConfigCreateDto } from './day-action-config-create-dto';
export interface DayCreateDto {
  dayActions?: null | Array<DayActionConfigCreateDto>;
  description: string;
  externalId: number;
}

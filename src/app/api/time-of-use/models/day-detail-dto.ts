/* tslint:disable */
/* eslint-disable */
import { DayActionDetailDto } from './day-action-detail-dto';
export interface DayDetailDto {
  configurationId?: string;
  dayActions?: null | Array<DayActionDetailDto>;
  description: string;
  externalId: number;
  id?: string;
}

/* tslint:disable */
/* eslint-disable */
import { SlaBaseDto } from './sla-base-dto';
export interface QualityTrendSlaDto {
  id?: string;
  qualityTrendSlaData?: null | {
    [key: string]: SlaBaseDto;
  };
}

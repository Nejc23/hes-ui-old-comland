import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface MeterUnitsList {
  id: number;
  status: string;
  nextRead: string;
  name: string;
  readStatusPercent: number;
  vendor: string;
  parent: string;
  moduleId: string;
  meterId: string;
  firmware: string;
  timeOfUseId: string;
  id5: string;
  childInfo: number;
  breakerState: boolean;
  tags: string[];
}

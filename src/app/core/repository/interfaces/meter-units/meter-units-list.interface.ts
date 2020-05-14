import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface MeterUnitsList {
  id: string;
  status: string;
  nextRead: string;
  name: string;
  readStatusTimeStamp: string;
  readStatusColor: string;
  vendor: string;
  parent: string;
  moduleId: string;
  meterId: string;
  firmware: string;
  timeOfUseId: string;
  id5: string;
  childInfo: number;
  breakerState: string;
  tags: string[];
  jobStatus: string;
}

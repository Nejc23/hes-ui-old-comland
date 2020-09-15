import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface MeterUnitDetailForm {
  deviceId: string;
  name: string;
  status: Codelist<number>;
  type: Codelist<number>;
  vendor: Codelist<number>;
  template: Codelist<string>;
  logicalDeviceName: string;
  id5: string;
}

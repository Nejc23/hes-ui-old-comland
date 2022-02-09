export interface MeterUnitDetailsForm {
  deviceId: string;
  name: string;
  firstInstalledDate: Date;
  // status: Codelist<number>;
  // type: Codelist<number>;
  // vendor: Codelist<number>;
  // template: Codelist<string>;
  status: string;
  type: number;
  vendor: string;
  template: string;
  systitle: string;
  id: string;
  mac: string;
  address: string;
}

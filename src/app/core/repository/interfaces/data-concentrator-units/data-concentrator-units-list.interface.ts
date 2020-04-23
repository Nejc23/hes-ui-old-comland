export interface DataConcentratorUnitsList {
  id: string;
  status: string;
  nextRead: string;
  name: string;
  metersValue: number;
  metersPercent: number;
  metersUp: boolean;
  readStatusPercent: number;
  type: string;
  vendor: string;
  idNumber: string;
  ip: string;
  lastCommunication: string;
  tags: string[];
}

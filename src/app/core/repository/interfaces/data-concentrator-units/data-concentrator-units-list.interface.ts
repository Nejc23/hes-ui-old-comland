export interface DataConcentratorUnitsList {
  id: string;
  status: string;
  nextRead: string;
  name: string;
  metersValue: number;
  metersPercent: number;
  metersUp: boolean;
  readStatusTimeStamp: string;
  readStatusColor: string;
  type: string;
  vendor: string;
  idNumber: string;
  ip: string;
  lastCommunication: string;
  tags: string[];
  jobStatus: string;
}

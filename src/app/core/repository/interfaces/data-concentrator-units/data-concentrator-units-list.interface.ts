export interface DataConcentratorUnitsList {
  concentratorId: string;
  status: string;
  name: string;
  meters: number;
  metersPercent: number;
  metersUp: boolean;
  readStatusTimeStamp: string;
  readStatusColor: string;
  type: string;
  vendor: string;
  id: string;
  ip: string;
  lastCommunication: string;
  tags: string[];
  jobStatus: string;
  discoveryJob?: string;
  hasActiveJob: boolean;
}

export interface DataConcentratorUnitsList {
  concentratorId: string;
  hostname: string;
  externalId?: string;
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
  lastCommunication: string;
  firmwareApp: string;
  firmwareBase: string;
  tags: string[];
  jobStatus: string;
  discoveryJob?: string;
  hasActiveJob: boolean;
}

import { InstantValue } from './instant-value.interface';

export interface MeterUnitsList {
  deviceId: string;
  status: string;
  name: string;
  readStatusTimeStamp: string;
  readStatusColor: string;
  vendor: string;
  parent: string;
  parentId: string;
  moduleId: string;
  meterId: string;
  firmware: string;
  timeOfUseId: string;
  id5: string;
  childInfo: number;
  disconnectorState: string;
  tags: string[];
  jobStatus: string;
  configurationId: string;
  logicalDeviceName: string;
  id1: string;
  id2: string;
  id3: string;
  id4: string;
  id6: string;
  parametrisationId: string;
  readyForActivation: boolean;
  hasActiveJobs: boolean;
  ciiState: string;
  serialNumber: string;
  instantValues?: InstantValue[];
  protocolType: string;
}

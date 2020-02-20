export interface Sample {
  status: string;
  name: string;
  meters: number;
  readStatus: number;
  readStatusColor: string;
  type: string;
  vendor: string;
  id: string;
  ip: string;
  lastCommunication: string;
  tags: [string];
}

export interface DataConcentratorUnit {
  concentratorId: string;
  statusValue: string;
  statusId: number;
  name: string;
  typeValue: string;
  typeId: number;
  vendorValue: string;
  vendorId?: number;
  id: string;
  ip: string;
  tags: string;
  address: string;
  port: string;
  mac: string;
  username: string;
}

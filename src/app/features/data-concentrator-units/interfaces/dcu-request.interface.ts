export interface DcuRequest {
  concentratorId: string;
  concentratorIp: string;
  type: number;
  vendor: number;
  name: string;
  userName?: string;
  password?: string;
}

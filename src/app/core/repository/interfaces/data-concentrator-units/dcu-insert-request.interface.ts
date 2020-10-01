export interface DcuInsertRequest {
  concentratorId: string;
  concentratorIp: string;
  type: number;
  vendor: number;
  name: string;
  userName?: string;
  password?: string;
  address?: string;
  mac?: string;
  status?: number;
  port?: string;
}
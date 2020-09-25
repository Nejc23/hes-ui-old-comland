export interface DcuUpdateRequest {
  ip: string;
  // type: number;
  // vendor: number;
  name: string;
  serialNumber: string;
  userName?: string;
  password?: string;
  address?: string;
  // mac?: string;
  // status?: number;
  port?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

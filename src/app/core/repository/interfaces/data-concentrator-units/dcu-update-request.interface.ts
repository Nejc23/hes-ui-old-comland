export interface DcuUpdateRequest {
  hostname: string;
  // type: number;
  // vendor: number;
  name: string;
  serialNumber: string;
  externalId: string;
  userName?: string;
  //password?: string;
  address?: string;
  // mac?: string;
  // status?: number;
  // latitude?: number;
  // longitude?: number;
  // tags?: string[];
}

export interface ValidateHostnameRequest {
  hostname: string;
}

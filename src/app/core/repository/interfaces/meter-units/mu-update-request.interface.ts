export interface MuUpdateRequest {
  deviceId: string;
  name: string;
  address: string;
  serialNumber: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

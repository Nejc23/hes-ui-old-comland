export interface MuUpdateRequest {
  name: string;
  address: string;
  serialNumber: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

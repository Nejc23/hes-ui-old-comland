export interface UsersSample {
  data: Data[];
  totalCount: number;
  summary: string;
  groupCount: number;
}

export interface Data {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}
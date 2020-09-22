export interface DataProcessingRequest {
  deviceIds: string[];
  profiles: DataProcessingProfile[];
  startTime: string;
  endTime: string;
}

export interface DataProcessingProfile {
  profileId: string;
  registerIds: string[];
}

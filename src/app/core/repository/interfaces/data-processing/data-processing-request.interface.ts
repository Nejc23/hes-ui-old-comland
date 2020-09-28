export interface DataProcessingRequest {
  deviceIds: string[];
  startTime: string;
  endTime: string;
  profiles?: DataProcessingProfile[];
  registerIds?: string[];
}

export interface DataProcessingProfile {
  profileId: string;
  registerIds: string[];
}

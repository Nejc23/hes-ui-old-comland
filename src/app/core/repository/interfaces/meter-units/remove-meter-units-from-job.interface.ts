export interface RequestRemoveMeterUnitsFromJob {
  requestId: string;
  scheduleId: string;
  devices: string[];
}

export interface ResponseRemoveMeterUnitsFromJob {
  requestId: string;
  success: boolean;
}

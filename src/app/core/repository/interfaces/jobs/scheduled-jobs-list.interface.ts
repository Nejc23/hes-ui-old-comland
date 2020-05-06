export interface ScheduledJobsList {
  id: string;
  active: boolean;
  type: string;
  description: string;
  nextRun: string;
  owner: string;
}

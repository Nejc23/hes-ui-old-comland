export interface SchedulerJobsList {
  id: string;
  active: boolean;
  type: string;
  jobType: number;
  description: string;
  nextRun: string;
  owner: string;
  deviceCount: number;
}

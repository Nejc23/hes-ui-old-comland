export interface SchedulerJobsList {
  id: string;
  active: boolean;
  type: string;
  jobType: number | string;
  description: string;
  nextRun: string;
  owner: string;
  deviceCount: number;
  jobId: string;
}

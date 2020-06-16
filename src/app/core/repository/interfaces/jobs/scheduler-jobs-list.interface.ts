export interface SchedulerJobsList {
  id: string;
  active: boolean;
  type: string;
  description: string;
  nextRun: string;
  owner: string;
}

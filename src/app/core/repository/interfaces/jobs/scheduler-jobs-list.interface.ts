export interface SchedulerJobsList {
  id: string;
  active: boolean;
  type: string;
  actionType: number;
  description: string;
  nextRun: string;
  owner: string;
}

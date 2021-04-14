export interface JobInterface {
  jobName: string;
  state: string;
  status: string;
  lastUpdated: string;
}

export interface ActiveJobInterface {
  totalJobs: number;
  runningJobs: number;
  pendingJobs: number;
  jobs: Array<JobInterface>;
}

export interface Job {
  jobName: string;
  state: string;
  status: string;
  lastUpdated: string;
}

export interface ActiveJob {
  totalJobs: number;
  runningJobs: number;
  pendingJobs: number;
  jobs: Array<Job>;
}

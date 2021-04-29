import { JobTypeEnumeration } from '../enums/job-type.enum';

export interface AddJobParams {
  jobType: JobTypeEnumeration;
  jobName: string;
  deviceType: string;
  icon: string;
  isIconOutlined?: boolean;
  cssClasses?: string;
  hasUserAccess: boolean;
}

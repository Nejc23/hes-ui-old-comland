/* tslint:disable */
/* eslint-disable */
import { AlarmNotificationFilterDto } from './alarm-notification-filter-dto';
import { JobType } from './job-type';
export interface ScheduledNotificationDto {
  active: boolean;
  addresses?: null | Array<string>;
  cronExpression: string;
  description?: null | string;
  endAt?: null | string;
  jobType: JobType;
  notificationFilter?: AlarmNotificationFilterDto;
  scheduleJobId?: string;
  startAt?: null | string;
}

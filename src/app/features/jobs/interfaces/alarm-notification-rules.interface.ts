import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface AlarmNotificationRules {
  isAlarmIdActive: boolean;
  alarmIds: Codelist<number>[];
  isSeverityActive: boolean;
  severities: Codelist<number>[];
  isProtocolActive: boolean;
  protocols: Codelist<number>[];
  isManufacturerActive: boolean;
  manufacturers: Codelist<number>[];
  isSourceActive: boolean;
  sources: Codelist<number>[];
  addresses: Codelist<number>[];
  notificationType: Codelist<number>;
  webhookAddress: string;
}

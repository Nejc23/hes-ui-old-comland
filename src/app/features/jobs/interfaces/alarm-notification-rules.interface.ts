import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
export interface AlarmNotificationRules {
  isAlarmIdActive: boolean;
  alarmIds: Codelist<number>[];
  isSeverityActive: boolean;
  severities: Codelist<number>[];
  isProtocolActive: boolean;
  protocols: Codelist<number>[];
  isManufacturerActive: boolean;
  manufactrers: Codelist<number>[];
  isSourceActive: boolean;
  activeSources: Codelist<number>[];
}

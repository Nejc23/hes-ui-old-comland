import { IActionRequestFwUpgradeData } from '../myGridLink/action-prams.interface';

export interface MeterUnitsFwUpgradeForm extends IActionRequestFwUpgradeData {
  files: Array<any>;
}

export interface FileGuid {
  imageGuid: string;
}

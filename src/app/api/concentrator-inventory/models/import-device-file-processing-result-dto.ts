/* tslint:disable */
/* eslint-disable */
import { ImportDeviceResultDto } from './import-device-result-dto';
import { ImportResult } from './import-result';
export interface ImportDeviceFileProcessingResultDto {
  deviceImportResults?: null | Array<ImportDeviceResultDto>;
  messages?: null | Array<string>;
  requestId?: string;
  status?: ImportResult;
}

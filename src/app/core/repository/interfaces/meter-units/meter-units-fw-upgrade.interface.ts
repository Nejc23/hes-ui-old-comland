import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';

export interface MeterUnitsFwUpgrade {
  fileId: string;
  imageIdent: string;
  imageSize: number;
  signature: string;
  overrideFillLastBlock: boolean;
  deviceIds: string[];
  // bulkActionsRequestParam: GridBulkActionRequestParams;
}
export interface MeterUnitsFwUpgradeForm extends MeterUnitsFwUpgrade {
  files: Array<any>;
}

export interface FileGuid {
  imageGuid: string;
}
export interface DcResponse {
  fileId: string;
  imageIdent: string;
  imageSize: number;
  signature: string;
  overrideFillLastBlock: boolean;
  deviceIds: string[];
  requestId: string;
}

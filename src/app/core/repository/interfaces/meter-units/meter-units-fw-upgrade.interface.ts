import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';

export interface MeterUnitsFwUpgrade {
  imageGuid: string;
  imageIdenifyer: string;
  imageSize: number;
  imageSignature: string;
  imageFillLastBlock: boolean;
  bulkActionsRequestParam: GridBulkActionRequestParams;
}
export interface MeterUnitsFwUpgradeForm extends MeterUnitsFwUpgrade {
  files: Array<any>;
}

export interface FileGuid {
  imageGuid: string;
}
export interface DcResponse {
  status: string;
}

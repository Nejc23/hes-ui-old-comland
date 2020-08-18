import { CryptoImportResponse } from './crypto-import-response.interface';

export interface CryptoImportCheckResponse extends CryptoImportResponse {
  fileName: string;
  meterCount: number;
  keyCount: number;
  status: string;
}

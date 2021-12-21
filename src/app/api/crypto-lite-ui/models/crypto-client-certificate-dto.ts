/* tslint:disable */
/* eslint-disable */
import { CryptoCertificateRequestStatus } from './crypto-certificate-request-status';

export interface CryptoClientCertificateDto {
  createdAt?: null | string;
  requestId?: string;
  status?: CryptoCertificateRequestStatus;
  subject?: null | string;
  updatedAt?: null | string;
  userId?: null | string;
  username?: null | string;
}

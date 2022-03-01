import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoClientCertificateDto } from '../../../../api/crypto-lite-ui/models/crypto-client-certificate-dto';
import { ManagementService } from '../../../../api/crypto-lite-ui/services/management.service';
import { StrictHttpResponse } from '../../../../api/crypto-lite-ui/strict-http-response';
import { CryptoCredentialDto } from '../../../../api/crypto-lite-ui/models/crypto-credential-dto';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private managementService: ManagementService) {}

  getAllClientCertificates(): Observable<Array<CryptoClientCertificateDto>> {
    return this.managementService.managementClientCertificatesRequestGet$Json();
  }

  getPendingClientCertificates(): Observable<Array<CryptoClientCertificateDto>> {
    return this.managementService.managementClientCertificatesRequestPendingGet$Json();
  }

  grantClientCertificate(params: { id: string }): Observable<StrictHttpResponse<void>> {
    return this.managementService.managementClientCertificateRequestIdConfirmPost$Response(params);
  }

  rejectClientCertificate(params: { id: string }): Observable<StrictHttpResponse<void>> {
    return this.managementService.managementClientCertificateRequestIdRejectPost$Response(params);
  }

  downloadDataConcentratorClientCert(params?: { body?: CryptoCredentialDto }): Observable<StrictHttpResponse<Blob>> {
    return this.managementService.managementDownloadDataconcentratorClientCertificatePost$Json$Response(params);
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { importDeviceKeys } from '../../consts/crypto-lite.const';
import { CryptoImportCheckResponse } from '../../interfaces/crypto-lite/crypto-import-check-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CryptoLiteService {
  constructor(private repository: RepositoryService) {}

  checkCryptoImport(importId: string): Observable<CryptoImportCheckResponse> {
    return this.repository.makeRequest(this.checkCryptoImportRequest(importId));
  }

  checkCryptoImportRequest(importId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${importDeviceKeys}/${importId}`);
  }

  uploadCryptoImport(): Observable<CryptoImportCheckResponse> {
    return this.repository.makeRequest(this.uploadCryptoImportRequest());
  }

  uploadCryptoImportRequest(): HttpRequest<any> {
    return new HttpRequest('POST', `${importDeviceKeys}`, null);
  }
}

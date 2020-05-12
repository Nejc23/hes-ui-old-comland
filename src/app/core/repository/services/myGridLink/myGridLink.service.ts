import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import {
  IdentityToken,
  LastStatus,
  RequestConnectDisconnectData,
  ResponseConnectDisconnectData,
  RequestTOUData,
  ResponseTOUData,
  OnDemandRequestData
} from '../../interfaces/myGridLink/myGridLink.interceptor';
import {
  enumMyGridLink,
  identityToken,
  lastStatus,
  onDemandConnect,
  onDemandDisconnect,
  triggerSetTimeOfUse,
  onDemandDisconnectorState,
  onDemandData
} from '../../consts/my-grid-link.const';

@Injectable({
  providedIn: 'root'
})
export class MyGridLinkService {
  constructor(private repository: RepositoryService) {}

  // get identity token
  getMyGridIdentityToken(): Observable<IdentityToken> {
    return this.repository.makeRequest(this.getMyGridIdentityTokenRequest());
  }

  getMyGridIdentityTokenRequest(): HttpRequest<IdentityToken> {
    return new HttpRequest('GET', `${enumMyGridLink.identityTokenServer}${identityToken}`);
  }

  // get last status
  getMyGridLastStatus(requestId: string): Observable<LastStatus[]> {
    return this.repository.makeRequest(this.getMyGridLastStatusRequest(requestId));
  }

  getMyGridLastStatusRequest(requestId: string): HttpRequest<LastStatus[]> {
    return new HttpRequest('GET', `${enumMyGridLink.managment}/${requestId}${lastStatus}`);
  }

  // connect device
  postMyGridConnectDevice(params: RequestConnectDisconnectData): Observable<ResponseConnectDisconnectData> {
    return this.repository.makeRequest(this.postMyGridConnectDeviceRequest(params));
  }

  postMyGridConnectDeviceRequest(params: RequestConnectDisconnectData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandConnect}`, params);
  }

  // disconnect device
  postMyGridDisconnectDevice(params: RequestConnectDisconnectData): Observable<ResponseConnectDisconnectData> {
    return this.repository.makeRequest(this.postMyGridDisconnectDeviceRequest(params));
  }

  postMyGridDisconnectDeviceRequest(params: RequestConnectDisconnectData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandDisconnect}`, params);
  }

  // trigger TOU
  postMyGridTOUDevice(params: RequestTOUData): Observable<ResponseTOUData> {
    return this.repository.makeRequest(this.postMyGridTOUDeviceRequest(params));
  }

  postMyGridTOUDeviceRequest(params: RequestTOUData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerSetTimeOfUse}`, params);
  }

  // get disconnector state
  getDisconnectorState(params: RequestConnectDisconnectData): Observable<ResponseConnectDisconnectData> {
    return this.repository.makeRequest(this.getDisconnectorStateRequest(params));
  }

  getDisconnectorStateRequest(params: RequestConnectDisconnectData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandDisconnectorState}`, params);
  }

  // get data returned on-demand requests
  getOnDemandDataProcessing(requestId: string): Observable<OnDemandRequestData> {
    return this.repository.makeRequest(this.getOnDemandDataProcessingRequest(requestId));
  }

  getOnDemandDataProcessingRequest(requestId: string): HttpRequest<OnDemandRequestData> {
    return new HttpRequest('GET', `${enumMyGridLink.dataProcessing}/${requestId}${onDemandData}`);
  }
}

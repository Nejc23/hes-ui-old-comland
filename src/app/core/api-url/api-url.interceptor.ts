import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../configuration/services/app-config.service';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let urlPath = '';
    if (AppConfigService.settings && AppConfigService.settings?.apiServer?.url !== '') {
      console.log('1.ApiUrlInterceptor ', AppConfigService.settings.apiServer.url);
      urlPath = AppConfigService.settings.apiServer.url;
    }
    const apiReq = request.clone({ url: `${urlPath}${request.url}` });
    console.log('2.ApiUrlInterceptor ', apiReq);
    return next.handle(apiReq);
    // }
  }
}

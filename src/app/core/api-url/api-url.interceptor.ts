import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../configuration/services/app-config.service';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let urlPath = '';
    if (AppConfigService.settings) {
      urlPath = AppConfigService.settings.apiServer.url;
    }
    const apiReq = request.clone({ url: `${urlPath}${request.url}` });
    return next.handle(apiReq);
    // }
  }
}

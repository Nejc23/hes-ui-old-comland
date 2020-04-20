import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { enumMyGridLink } from '../repository/consts/my-grid-link.const';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if url request is for myGridLink server
    if (this.checkIfMyGridLinkUrl(request)) {
      const apiReq = request.clone({ url: `${environment.apiMyGridUrl}${request.url}` });
      console.log('mygrid????');
      return next.handle(apiReq);
    } else {
      const apiReq = request.clone({ url: `${environment.apiUrl}${request.url}` });
      return next.handle(apiReq);
    }
  }

  /**
   * Check if request is for BE server myGrid.Link
   * @param request request data
   */
  private checkIfMyGridLinkUrl(request: HttpRequest<any>) {
    const listOfMyLinkApiUrl = Object.values(enumMyGridLink);
    if (listOfMyLinkApiUrl.some(v => request.url.includes(v))) {
      return true;
    }
    return false;
  }
}

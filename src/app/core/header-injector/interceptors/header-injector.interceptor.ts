import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { languages } from 'src/environments/config';
import { dcOperationFwUpgrade } from '../../repository/consts/data-concentrator-units.const';
import { fwUploadFile } from '../../repository/consts/meter-units.const';

@Injectable()
export class HeaderInjectorInterceptor implements HttpInterceptor {
  locale = '';
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.locale = localStorage.getItem('lang') || 'en';
    let newRequest = request.clone({
      headers: request.headers.set('Content-Type', 'application/json').set('Accept-Language', this.localeToHeaderLocale())
    });

    // don't use application/json Content-Type for file uploads
    if (newRequest.url.toLowerCase().includes(dcOperationFwUpgrade) || newRequest.url.toLowerCase().includes(fwUploadFile)) {
      newRequest = request.clone({
        headers: request.headers.set('Accept-Language', this.localeToHeaderLocale())
      });
    }
    return next.handle(newRequest);
  }

  localeToHeaderLocale(): string {
    if (this.locale && this.locale !== null) {
      const loc = _.find(languages, (x) => x.id === this.locale);
      if (loc !== undefined && loc !== null) {
        return loc.acceptLanguage;
      } else {
        return this.locale;
      }
    } else {
      throw new Error('locale not supported!');
    }
  }
}

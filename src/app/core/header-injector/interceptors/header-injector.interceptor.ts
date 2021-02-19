import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { languages } from 'src/environments/config';
import { dcOperationFwUpgrade } from '../../repository/consts/data-concentrator-units.const';
import { fwUploadFile } from '../../repository/consts/meter-units.const';

@Injectable()
export class HeaderInjectorInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
      console.log(2);
      const loc = _.find(languages, (x) => x.id === this.locale);
      if (loc !== undefined && loc !== null) {
        console.log(4);
        return loc.acceptLanguage;
      } else {
        console.log(5);
        return this.locale;
      }
    } else {
      console.log(6);
      throw new Error('locale not supported!');
    }
  }
}

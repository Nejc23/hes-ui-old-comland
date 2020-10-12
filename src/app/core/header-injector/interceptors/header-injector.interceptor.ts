import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { languages } from 'src/environments/config';

@Injectable()
export class HeaderInjectorInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(this.locale);
    const newRequest = request.clone({
      headers: request.headers.set('Content-Type', 'application/json').set('Accept-Language', this.localeToHeaderLocale())
    });
    console.log(newRequest);
    return next.handle(newRequest);
  }

  localeToHeaderLocale(): string {
    if (this.locale && this.locale !== null) {
      console.log(2);
      const loc = _.find(languages, x => x.id === this.locale);
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

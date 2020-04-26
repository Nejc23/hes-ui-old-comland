import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { languages } from 'src/environments/config';

@Injectable()
export class HeaderInjectorInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = request.clone({
      headers: request.headers.set('Content-Type', 'application/json').set('Accept-Language', this.localeToHeaderLocale())
    });

    return next.handle(newRequest);
  }

  localeToHeaderLocale(): string {
    if (this.locale && this.locale !== null) {
      const loc = _.find(languages, x => x.id === this.locale);
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

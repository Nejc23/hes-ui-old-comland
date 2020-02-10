import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError, Subscription } from 'rxjs';
import { delay, catchError, finalize } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  delay: Subscription | null = null;

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cRequest = request.clone({
      withCredentials: true
    });

    return next.handle(cRequest).pipe(catchError(this.handleError.bind(this)));
  }

  handleError(error: any, rep: any) {
    this.setupToastObservable(error);
    return throwError(error);
  }

  setupToastObservable(error: any) {
    if (this.delay) {
      return;
    }
    const errorHandlerService = this.injector.get<ErrorHandlerService>(ErrorHandlerService);

    this.delay = of(null)
      .pipe(
        delay(3000),
        finalize(() => {
          this.delay = null;
        })
      )
      .subscribe(() => {});
    errorHandlerService.showToast(error);
  }
}

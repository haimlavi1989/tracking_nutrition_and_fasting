import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import {AppErrorHandler} from "./app-error-handler";
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse?.error?.message.includes('jwt expired')) {
              this.router.navigate(['/login']).then(() => {
                  console.log('jwt expired redirect to /login')
              });
        }
        const errorMessage = errorResponse?.error?.message || 'An unknown error occurred!';
        return throwError(() => {
            return new AppErrorHandler().handleError(
              errorMessage
            );
        });
      })
    );
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { BadInput } from './../erorrs/bad-input';
import { NotFoundError } from './../erorrs/not-found-error';
import { environment } from '../../../../environments/environment';
import {AppErrorHandler} from "../erorrs/app-error-handler";


@Injectable({
  providedIn: 'root'
})

export class DataService {

  basicUrl = environment.apiUrl;
  constructor(
    private http: HttpClient) { }

  getAll(rout: string) {
    return this.http
      .get(this.basicUrl + rout)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getOne(rout: string) {
    return this.http
      .get(this.basicUrl + rout)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  create(rout: string, resource: any) {
    return this.http
      .post(this.basicUrl + rout, resource, {})
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  update(rout: string, resource: any) {
    return this.http
      .patch(this.basicUrl + rout + '/' + resource?.id, resource)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  delete(rout: string, id: string) {
    return this.http
      .delete(this.basicUrl + rout + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private handleError(response: any) {

    if (response.status === 400) {
          return throwError(() => {
            const error: any = new BadInput().handleError(
              response?.error?.message || 'An unknown error occurred!'
            );
            return error;
          });
    }

    if (response.status === 404) {
        return throwError(() => {
              const error: any = new NotFoundError().handleError(
                response?.error?.message || 'An unknown error occurred!'
              );
              return error;
        });
    }

    return throwError(() => {
            const error: any = new AppErrorHandler().handleError(
              response?.error?.message || 'An unknown error occurred!'
            );
            return error;
    });

  }
}

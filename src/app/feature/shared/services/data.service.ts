import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BadInput } from './../erorrs/bad-input';
import { NotFoundError } from './../erorrs/not-found-error';
import { environment } from '../../../../environments/environment.development';
import {AppErrorHandler} from "../erorrs/app-error-handler";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //private basicUrl: string = "https://tracking-nutrition-and-fasting-backend.onrender.com/api/v1/";
  private basicUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(rout: string) {
    return this.sendRequest('GET', rout);
  }

  getOne(rout: string) {
    return this.sendRequest('GET', rout);
  }

  create(rout: string, resource: any) {
    return this.sendRequest('POST', rout, resource);
  }

  update(rout: string, resource: any) {
    return this.sendRequest('PATCH', `${rout}/${resource?.id}`, resource);
  }

  delete(rout: string, id: string) {
    return this.sendRequest('DELETE', `${rout}/${id}`);
  }

  private sendRequest(method: string, rout: string, body?: any) {
    return this.http.request(method, `${this.basicUrl}${rout}`, { body })
      .pipe(
        //retry(2),
        catchError(this.handleError)
      );
  }

  private handleError(response: any) {

    if (response.status === 400) {
          return throwError(() => {
            const error: any = new BadInput().handleError(
              response?.error?.message
            );
            return error;
          });
    }

    if (response.status === 404) {
        return throwError(() => {
              const error: any = new NotFoundError().handleError(
                response?.error?.message
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

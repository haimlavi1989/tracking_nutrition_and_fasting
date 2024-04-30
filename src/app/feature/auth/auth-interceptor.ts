import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler
  } from "@angular/common/http";
  import { Injectable } from "@angular/core";

  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

      const currentUser = JSON.parse(<string>localStorage.getItem('currentUser')) ;

      if (currentUser) {
        const cloned  = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + currentUser.token)
        });

        return next.handle(cloned);
      }
      else {
        return next.handle(req);
      }
    }
  }

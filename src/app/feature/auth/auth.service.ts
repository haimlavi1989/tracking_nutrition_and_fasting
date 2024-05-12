import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as authData from "./auth-data.model";
import { Router } from "@angular/router";
import {DataService} from "../shared/services/data.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<authData.userData | null>;
    public currentUser: Observable<authData.userData | null>;
    private tokenExpirationTimer: any;
    private apiUrl = ''
    private resourceSignup = 'users/signup'
    private resourceLogin = 'users/login'

    constructor(private http: HttpClient,
                private router: Router,
                private dataService: DataService
    ) {
        this.currentUserSubject = new BehaviorSubject<authData.userData | null>(null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): authData.userData | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.dataService.create(this.resourceLogin, { email, password })
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(["/login"]);
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
          this.tokenExpirationTimer = null;
    }

    private setLogoutTimer(expirationDuration: number) {
      if (!this.tokenExpirationTimer) {
          this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
         }, expirationDuration);
      }
    }

    signup(data: authData.signupData) {
        return this.dataService.create(this.resourceSignup, data)
    }

    handleLogin(response: any) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        response["tokenDate"] = new Date();
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.handleAuthentication();
        this.router.navigate(["/home"]);
    }
    // on each application startup check if user is authenticated
    handleAuthentication() {
      let currentUser: any = JSON.parse(<string>localStorage.getItem('currentUser'));
        if (currentUser) {
          // check token token expiration date
          const tokenTimeLift = this.tokenTimeLift(currentUser)
          if ( tokenTimeLift > 0 ){
            // notify all subsibers that user is auth
            this.currentUserSubject.next(currentUser);
            // active auto logout timer
            this.setLogoutTimer(tokenTimeLift);
          }
        }
    }
    // return time left for token in miliseconds
    tokenTimeLift(currentUser: any) {
      const expirationDate = new Date(new Date(currentUser.tokenDate).getTime() + currentUser.expiresIn * 1000).getTime();
      const now = new Date().getTime();
      return (expirationDate - now);
    }
}

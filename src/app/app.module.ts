import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './feature/login/login.component';
import { HeaderComponent } from './feature/header/header.component';
import { RegisterComponent } from './feature/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { AuthInterceptor } from "./feature/auth/auth-interceptor";
import { SharedModule } from './feature/shared/shared.module';
import { AuthService } from './feature/auth/auth.service';
import { ErrorInterceptor } from './feature/shared/erorrs/error-interceptor';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './feature/home/home.component';
import { DietsComponent } from './feature/diets/diets.component';
import { DietComponent } from './feature/diet/diet.component';
import {DietsService} from "./feature/diets/diets.service";
import { DatePipe } from '@angular/common';
import { ReminderComponent } from './feature/reminder/reminder.component';
import { WeightTrackingComponent } from './feature/weight-tracking/weight-tracking.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    RegisterComponent,
    HomeComponent,
    DietsComponent,
    DietComponent,
    ReminderComponent,
    WeightTrackingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgApexchartsModule
  ],
  providers: [
    DatePipe,
    DietsService,
        // { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha_key },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

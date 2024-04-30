import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './feature/login/login.component';
import { RegisterComponent } from './feature/register/register.component';
import { AuthGuard } from "./feature/auth/auth.guard";
import {HomeComponent} from "./feature/home/home.component";
import {WeightTrackingComponent} from "./feature/weight-tracking/weight-tracking.component"


 const routes: Routes = [
    { path : 'login', component : LoginComponent },
    { path : 'register', component : RegisterComponent },
    { path : 'home', component : HomeComponent, canActivate: [AuthGuard]},
    { path : 'graphs', component : WeightTrackingComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}

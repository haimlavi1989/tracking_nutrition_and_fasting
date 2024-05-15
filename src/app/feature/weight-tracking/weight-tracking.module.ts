import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WeightTrackingComponent } from './weight-tracking.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthGuard } from '../auth/auth.guard';
import { SharedModule } from './../shared/shared.module';

const routes: Routes = [
  { path: '', component: WeightTrackingComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [WeightTrackingComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class WeightTrackingModule { }
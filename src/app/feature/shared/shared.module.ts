import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AlertComponent } from './components/alert/alert.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './components/confirmatioin-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    PaginationComponent,
    AlertComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingSpinnerComponent,
    PaginationComponent,
    CommonModule,
    AlertComponent,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmationDialogComponent
  ],
  providers: []
})
export class SharedModule {}

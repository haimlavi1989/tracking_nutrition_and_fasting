import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { loginData } from "../auth/auth-data.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginFormGroup: any;
  public email = new FormControl();
  public password = new FormControl();
  public errorEmptyFields = '';
  public isLoading = false;
  public error = '';

  constructor(
    private authService:AuthService,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  createFormControls() {
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, [Validators.required, Validators.minLength(4)]);
  }

  initForm() {
    this.createFormControls();
    this.errorEmptyFields = "Can not be empty!";
    this.loginFormGroup = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  onSubmit() {
    this.isLoading = true;
    const data: loginData = {email: '', password: ''};
    data.email = this.loginFormGroup.get('email')?.value || ''
    data.password = this.loginFormGroup.get('password')?.value || ''
    this.authService.login(data.email, data.password).subscribe(
      (response: any) => {
        this.authService.handleLogin(response);
        this.isLoading = false;
      }, (errorResponse: any) => {
        this.isLoading = false;
        this.error = errorResponse?.error?.message;
      });
  }

  onHandleError() {
    this.error = '';
  }



}

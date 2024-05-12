import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { signupData } from "../auth/auth-data.model";
import { AuthService } from "../auth/auth.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerFormGroup: any;
  public fullname = new FormControl();
  public email = new FormControl();
  public password = new FormControl();
  public confirms = new FormControl();
  public age = new FormControl();
  public errorEmptyFields = '';
  public minlength4 = '';
  public minlength6 = '';
  public error = '';
  public isLoading = false;
  private signupSubscription: Subscription | undefined;

  constructor( private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  createFormControls() {
    this.fullname = new FormControl(null, [Validators.required, Validators.minLength(4)]);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, [Validators.required, Validators.minLength(6)]);
    this.confirms = new FormControl(null, [Validators.required, Validators.minLength(6), this.checkPasswords.bind(this)]);
    this.age = new FormControl(null, [Validators.required, Validators.min(18), Validators.max(120)]);
  }

  initForm() {
    this.createFormControls();
    this.errorEmptyFields = "Can not be empty!";
    this.minlength4 = "Min length is 4.";
    this.minlength6 = "Min length is 6.";
    this.registerFormGroup = new FormGroup({
      fullname: this.fullname,
      email: this.email,
      password: this.password,
      confirms: this.confirms,
      age: this.age
    });
  }

  checkPasswords() {
    let password = this.registerFormGroup?.get('password')?.value || '';
    let confirmPass = this.registerFormGroup?.get('confirms')?.value || "";
    return password === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    this.isLoading = true;
    const data: signupData = {name: '', email: '', password: '', passwordConfirm: '', age: 0};
    data.name = this.registerFormGroup.get('fullname')?.value || "";
    data.email = this.registerFormGroup.get('email')?.value || '';
    data.password = this.registerFormGroup.get('password')?.value || '';
    data.passwordConfirm = this.registerFormGroup.get('confirms')?.value || '';
    data.age = this.registerFormGroup.get('age')?.value || 18;

    this.signupSubscription = this.authService.signup(data).subscribe({
        next: (response: any) => {
          this.authService.handleLogin(response);
          this.isLoading = false;
        },
        error: (errorResponse: any) => {
          this.isLoading = false;
          this.error = errorResponse?.error?.message;
        },
        complete: () => {
          this.isLoading = false;
        }
    });
  }
  onHandleError() {
    this.error = '';
  }
  ngOnDestroy() {
    if (this.signupSubscription) {
      this.signupSubscription.unsubscribe();
    }
  }  
}

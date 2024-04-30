export interface loginData {
    email: string;
    password: string;
}

export interface signupData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  age: number;
}

export interface userData {
  userId: string;
  userRole: string;
  token: string;
  expiresIn: number;
  expirationDate: Date;
}
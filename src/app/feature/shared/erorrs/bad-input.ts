import {AppErrorHandler} from "./app-error-handler";

export class BadInput implements AppErrorHandler {
  handleError(error: any): void {
    if (error) {
      console.log(error);
    } else {
      console.log('Bad request. Please check your input data.');
    }  
  }
}

import {AppErrorHandler} from "./app-error-handler";

export class NotFoundError implements AppErrorHandler {
  handleError(error: any): void {
      if (error) {
        console.log(error);
      } else {
        console.log('Resource not found.');
      }  
  }
}

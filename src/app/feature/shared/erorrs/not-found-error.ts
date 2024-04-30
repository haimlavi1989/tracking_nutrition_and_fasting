import {AppErrorHandler} from "./app-error-handler";

export class NotFoundError implements AppErrorHandler {
  handleError(error: any): void {
      //alert('An error occurred.' + error);
      console.log(error);
  }
}

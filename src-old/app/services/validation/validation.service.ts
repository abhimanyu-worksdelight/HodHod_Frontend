import { Injectable } from '@angular/core';

const swal = require('sweetalert');

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // error alert box
  sweetalertError(data: any){
    swal(data, "", "error");
  }

  // alert box with custom message
  sweetalertNotificationSuccess(data: any){
    swal(data, "", "success");
  }
  
}

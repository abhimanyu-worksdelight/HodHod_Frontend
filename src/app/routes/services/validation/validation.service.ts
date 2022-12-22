import { Injectable } from '@angular/core';

const swal = require('sweetalert');

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // error alert box
  sweetalertError(message){
    swal(message, "", "error");
  }

  // success alert box
  sweetalertSuccess(){
    swal("Data saved successfully!", "", "success");
  }

  // update success alert box
  sweetalertUpdateSuccess(){
    swal("Data updated successfully!", "", "success");
  }

  // upload success alert box
  sweetalertFileUploadSuccess(){
    swal("file uploaded successfully!", "", "success");
  }
  
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { WindowService } from 'src/app/shared/window/window.service';
import "firebase/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  windowRef: any;
  phoneNumber: number = 0;

  constructor(
    public afAuth: AngularFireAuth,
    private windowService: WindowService,
    public router: Router
  ) { 
    this.windowRef = this.windowService.windowRef;
  }

  get isLoggedIn(): boolean {
    const uid = sessionStorage.getItem('otp');
    return (uid !== null) ? true : false;
  }

  sendOtp(){
    // this.afAuth.signInWithPhoneNumber((this.phoneNumber)
  }

  signout(){
    sessionStorage.removeItem('otp');
    this.router.navigate(['home']);
  }
  
}

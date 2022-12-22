import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
export interface User {
  uid: any;
  email: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userState: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) { }

  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("uid", result.user.uid)
        sessionStorage.setItem("uid", result.user.uid);

        // get all user type id
        this.getAllUserType();

        // admin tys vpe login
        var data = this.afs.collection(("users"), ref => ref.where('uid', '==', result.user.uid)).valueChanges().subscribe(res => {
          if (res != null) {
            data.unsubscribe();
            let loginData: any = res[0];
            console.log(" res", res)
            if (loginData != '' && loginData != null) {
              if (loginData.type != '' && loginData.type == "u7GeGmO2luLmkOMKeZ0k") {
                this.ngZone.run(() => {
                  sessionStorage.setItem("loginType", loginData.type);

                  this.router.navigate(['dashboard/dashboard-vendor']).then(() => {
                    // window.location.reload();
                  });
                });
              } else if (loginData.type != '' && loginData.type == "WxAsS1whStfbgdXvxqHs") {
                this.ngZone.run(() => {

                  sessionStorage.setItem("loginType", loginData.type);
                  this.router.navigate(['dashboard']).then(() => {
                    // window.location.reload();
                  });
                });
              }
            }
          }
        });

      }).catch((error) => {
        window.alert(error.message);
      })
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const userState: User = {
      uid: user.uid,
      email: user.email,
    }

    return userRef.set(userState, {
      merge: true
    })
  }

  get isLoggedInRole(): any {
    const role = sessionStorage.getItem('loginType');
    return (role !== null) ? role : false;
  }

  get isLoggedIn(): boolean {
    const uid = sessionStorage.getItem('uid');
    return (uid !== null) ? true : false;
  }

  getAllUserType() {
    this.afs.collection('user_types').get().subscribe(res => {
      res.forEach(e => {
        if (e.data()['type'] == 'store-owner') {
          console.log(e.data()['type'], e.id)
          sessionStorage.setItem('store-owner', e.id);

        } else if (e.data()['type'] == 'super-admin') {
          console.log(e.data()['type'], e.id)

          sessionStorage.setItem('super-admin', e.id);

        } else if (e.data()['type'] == 'customer') {
          console.log(e.data()['type'], e.id)

          sessionStorage.setItem('customer', e.id);
        }
      });
    });
  }

  emailSignup(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(value => {
      //  console.log("value.user.uid", value.user.uid);
      return value.user.uid;
    })
      .catch(error => {
        alert("The login email address is already in use by another account.");
        console.log('Something went wrong: ', error);
      });
  }

  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('uid');
      sessionStorage.removeItem("loginType");
      this.router.navigate(['login']);
    })
  }

}

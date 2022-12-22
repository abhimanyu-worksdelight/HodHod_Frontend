import { Component, OnInit } from '@angular/core';
import { UserblockService } from './userblock.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from 'src/app/authentication/auth.service';

const swal = require('sweetalert');

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    CurrentLoginUser: any;
    uid: string;
    image: any;
    loginType: string;
    full_name: string;
    adminName: string;
    adminTypeName: string;
    loginTypeName: string;

    constructor(
        public userblockService: UserblockService,
        private afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        public authService: AuthService,

    ) { }

    ngOnInit() {
        // get id of currect admin login
        this.uid = sessionStorage.getItem("uid");
        // console.log("current admin login", this.uid);

        this.loginType = sessionStorage.getItem("loginType");
        // console.log("current loginType", this.loginType);

        // image not get (default image)
        this.image = "../../../../assets/img/profile.jpg";

        // get current user login details start-----
        // manager type detail
        if (this.loginType == "WxAsS1whStfbgdXvxqHs") {
            var userData = this.afs.collection(("users"), ref => ref.where('uid', '==', this.uid)).get().subscribe(res => {
                if (res.size) {
                    userData.unsubscribe();
                    let superAdminDataArr: any = res.docs[0].data();

                    if (superAdminDataArr) {
                        this.full_name = superAdminDataArr.name;
                        this.adminName = "Super admin"
                        // this.adminTypeName = "Top admin";
                        this.loginTypeName = "";
                        if (superAdminDataArr.image) {
                            this.image = superAdminDataArr.image;
                        } else {
                            this.image = "../../../../assets/img/profile.jpg";
                        }
                    }
                }
            });
        } else if (this.loginType == "u7GeGmO2luLmkOMKeZ0k") {
            var userData = this.afs.collection(("users"), ref => ref.where('uid', '==', this.uid)).get().subscribe(res => {
                if (res.size) {
                    userData.unsubscribe();
                    let adminDataArr: any = res.docs[0].data();

                    if (adminDataArr) {
                        this.full_name = adminDataArr.name;
                        this.adminName = "Admin"
                        this.adminTypeName = "Store owner";
                        this.loginTypeName = "";
                        if (adminDataArr.image) {
                            this.image = adminDataArr.image;
                        } else {
                            this.image = "../../../../assets/img/profile.jpg";
                        }
                    }
                }
            });
        }
        // get current user login details end-----
    }

    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }


    logoutPopup() {
        this.sweetalertWarning();
    }
    // warning alert box
    sweetalertWarning() {
        swal({
            title: 'Are you sure you want to logout?',
            text: '',
            icon: 'warning',
            buttons: {
                cancel: {
                    text: 'Cancel',
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true
                },
                confirm: {
                    text: 'Yes',
                    value: true,
                    visible: true,
                    className: "bg-danger",
                    closeModal: true
                }
            }
        }).then((isConfirm) => {
            if (isConfirm) {
                this.authService.SignOut();

            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../../authentication/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ValidationService } from '../../../services/validation/validation.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-roles-add',
  templateUrl: './user-roles-add.component.html',
  styleUrls: ['./user-roles-add.component.scss']
})
export class UserRolesAddComponent implements OnInit {

  valForm: UntypedFormGroup;

  onToggleCheckValue: boolean = false;
  loading = false;
  saveLoading: boolean = false;
  downloadableURL: any;
  fileName: any;
  fileUrl: any;
  selectedFile: any;
  uid: string;
  userType: string;
  user_id: string;

  public positionItems: any = ["Business Manager", "Sales"];
  public disabled: boolean = false;
  public value: any = {};

  constructor(
    fb: UntypedFormBuilder,
    private userService: UserService,
    private afs: AngularFirestore,
    private authService: AuthService,
    public router: Router,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage
  ) {
    this.valForm = fb.group({
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'password': [null, Validators.required],
      'phone': [null, Validators.required],
      'isAdmin': [false, Validators.required],
      'file': '',
      // 'deviceType': [null, Validators.required],
      'roleType': [null, Validators.required],

    });
  }

  ngOnInit(): void {
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.userType = sessionStorage.getItem('customer');
    // console.log("this.userType", this.userType);
  }

  emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  onFileChanged(event: any) {
    if (event) {
      this.selectedFile = event.target.files[0];
      this.fileUrl = this.selectedFile.src;

      if (this.selectedFile.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (_event) => {
        this.fileUrl = reader.result;
      }
    }
  }

  addUserData($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid && this.selectedFile) {
      const file = this.selectedFile;
      const now = Date.now();
      const basePath = '/users';
      const filePath = `${basePath}/${now}-${file.name}`;
      const fileRef = this.fireStorage.ref(filePath);
      const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
      task.snapshotChanges().pipe(finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          if (url) {
            this.fileUrl = url;
            this.saveUserToDB(data, url);
          }
        });
      })).subscribe(url => {
        if (url) { }
      });

    } else {
      if (this.valForm.valid) {
        this.saveUserToDB(data, '');
      } else {
        console.log("this.valForm", this.valForm);
      }
    }
  }

  registerUser(data) {
    console.log("data", data);
    const { email, password } = data
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.user_id = res.user.uid;
          return resolve(res);
        }).catch(err => reject(err));
    })
  }

  saveUserToDB(data, image) {
    this.saveLoading = true;
    this.registerUser(data)
      .then(() => {
        let postData = {
          image,
          name: data.name,
          email: data.email,
          // device_type: data.deviceType,
          phone_number: data.phone,
          is_admin: data.isAdmin,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          uid: this.uid,
          type: this.userType,

          deleted_at: null,
          deleted_by: null,
          disabled: false,
          deleted_by_user_type: null
        };
        console.log("data", postData);

        this.userService.addUser(postData).then(() => {
          this.validationService.sweetalertSuccess();
          this.router.navigate(['/roles']);
        }).catch((err) => {
          console.log(err);
        });
      });
  }



}

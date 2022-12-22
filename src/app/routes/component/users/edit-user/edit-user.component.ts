import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  valForm: UntypedFormGroup;

  id: any;
  User: any;
  loading = false;
  fileName: any;
  fileUrl: any;
  selectedFile: any;
  public positionItems: any = ["Business Manager", "Sales"];

  constructor(
    fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage
  ) {
    this.valForm = fb.group({
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'phone': [null, Validators.required],
      'isAdmin': [false, Validators.required],
      'file': '',
      'deviceType': [null, Validators.required],
      'roleType': [null, Validators.required],

    });
  }

  emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  ngOnInit(): void {
    // read id from route url
    this.id = this.route.snapshot.params['id'];
    // console.log("id", this.id);

    this.userService.getUserDetail(this.id).get().subscribe((doc) => {
      if (doc.exists) {
        this.User = doc.data();
        this.fileName = this.User.image;
        this.fileUrl = this.User.image;
      } else {
        console.log("No such document!");
      }
    }, (error => {
      console.log("error", error);
    }));
  }

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

  editUserData($ev, data) {
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
            this.updateUserToDB(data, url);
          }
        });
      })).subscribe(url => {
        if (url) { }
      });

    } else {
      if (this.valForm.valid) {
        this.updateUserToDB(data, '');
      } else {
        console.log("this.valForm", this.valForm);
      }
    }
  }

  updateUserToDB(data, image) {
    let postData = {
      image,
      name: data.name,
      email: data.email,
      device_type: data.deviceType,
      role_type: data.roleType,
      phone_number: data.phone,
      is_admin: data.isAdmin,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    };
    // console.log("postData", postData);

    this.userService.updateUser(this.id, postData).then(() => {
      this.validationService.sweetalertSuccess();
    }).catch((err) => {
      console.log(err);
    });
  }

}

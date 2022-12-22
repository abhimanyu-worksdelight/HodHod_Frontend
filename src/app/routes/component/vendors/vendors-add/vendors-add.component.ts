import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { VendorsService } from '../../../services/vendors/vendors.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../../authentication/auth.service';
import { CategoryService } from '../../../services/category/category.service';
import { CitiesService } from '../../../services/cities/cities.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-vendors-add',
  templateUrl: './vendors-add.component.html',
  styleUrls: ['./vendors-add.component.scss']
})

export class VendorsAddComponent implements OnInit {
  // ng2Select
  public cityItems: any = [];
  public value: any = {};
  public disabled: boolean = false;

  valForm: UntypedFormGroup;
  selectedFile: any;
  loading = false;
  saveLoading: boolean = false;
  fileName: any;
  fileUrl: any;
  swithcButtonEnabled: boolean = false;
  switchButtonText: String = "This vendor will be shown when there are products available.";

  userType: string;
  loginType: string;
  uid: any;
  user_id: string;
  showPreviewBox: boolean = false;
  // location = {};
  Categories: any = [];
  category_id: string;

  // @ViewChild('addresstext') addresstext: any;

  constructor(
    private fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private vendorsService: VendorsService,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage,
    private userService: UserService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private cdref: ChangeDetectorRef,
    private citiesService: CitiesService
  ) {
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'name_arabic': '',
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'image': '',
      'isEnabled': [true, Validators.required],
      // 'address': [true, Validators.required],
      // 'currencyValue': [false, Validators.required],
      // 'currencyType': [true, Validators.required],
      'currencySarValue': [false, Validators.required],
      'currencyPercentValue': [false, Validators.required],
      'cat_id': [false, Validators.required],
      'productLimitation': [false, Validators.required],
      'city_id': [false, Validators.required],
      category: this.fb.array([]),
    });
  }

  emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  ngOnInit(): void {
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.userType = sessionStorage.getItem('store-owner');
    // console.log("this.userType", this.userType);
    if (this.userType == null) {
      this.authService.SignOut();
    }

    this.categoryService.getCategoryList().subscribe(res => {
      this.Categories = res.map(e => {
        let data: Object = e.payload.doc.data();
        return {
          id: e.payload.doc.id,
          ...data
        }
      })
    });

    // get city list
    this.getCitiesList();
    this.category().push(this.newCategory());
  }

  getCitiesList() {
    this.citiesService.getCitiesList().subscribe(res => {
      this.cityItems = [];
      res.map(e => {
        let data: Object = e.payload.doc.data();
        let cityPostData = {
          text: data['name_arabic'],
          id: e.payload.doc.id,
        }
        this.cityItems.push(cityPostData);
      });
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
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
        this.showPreviewBox = true;
      }
    }
  }

  addVendor($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid && this.selectedFile) {
      const file = this.selectedFile;
      const now = Date.now();
      const basePath = '/vendors';
      const filePath = `${basePath}/${now}-${file.name}`;
      const fileRef = this.fireStorage.ref(filePath);
      const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
      task.snapshotChanges().pipe(finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          if (url) {
            this.fileUrl = url;
            this.saveStoreToDB(data, url);
          }
        });
      })).subscribe(url => {
        if (url) { }
      });

    } else {
      if (this.valForm.valid) {
        this.saveStoreToDB(data, '');
      } else {
        console.log("this.valForm", this.valForm);
      }
    }
  }

  ngAfterViewInit() {
    // this.getPlaceAutocomplete();
  }

  // private getPlaceAutocomplete() {
  //   const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
  //     {
  //       componentRestrictions: { country: ['IND', 'US', 'AE'] },
  //     }
  //   );
  //   google.maps.event.addListener(autocomplete, 'place_changed', () => {
  //     const place = autocomplete.getPlace()
  //     this.location = {
  //       lat: place.geometry.location.lat(),
  //       lng: place.geometry.location.lng(),
  //       address: place.formatted_address,
  //     }
  //     // console.log("location", this.location);
  //   });
  // }

  registerUser(data) {
    const { email, password } = data
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.user_id = res.user.uid;
          return resolve(res);
        }).catch(err => reject(err));
    })
  }

  onChangeCategory(data) {
    this.category_id = data;
  }

  category(): UntypedFormArray {
    return this.valForm.get("category") as UntypedFormArray
  }

  newCategory(): UntypedFormGroup {
    return this.fb.group({
      cat_id: '',
      // currencyValue: '',
      // currencyType: '%',
      currencySarValue: '',
      currencyPercentValue: '',
      productLimitation: '',
    });
  }

  onSwitchChanged(value: boolean) {
    if (value == true) {
      this.switchButtonText = "This vendor will be shown when there are products available.";
    } else {
      this.switchButtonText = "This vendor will be hidden in the app.";

    }
  }

  addCategory() {
    this.category().push(this.newCategory());
  }

  removeCategory(empIndex: number) {
    this.category().removeAt(empIndex);
  }

  saveStoreToDB(data, image) {
    this.saveLoading = true;
    this.registerUser(data)
      .then(() => {
        let postData = {
          name: data.name,
          name_arabic: data.name_arabic,
          uid: this.user_id,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          created_by: this.uid,
          // categoryLimitation: data.categoryLimitation,
          // productLimitation: data.productLimitation,
          is_enabled: data.isEnabled,
          email: data.email,
          // _geoloc: this.location,
          image,
          city_id: data.city_id || [],
          categories: data.category || {},
          deleted_at: null,
          deleted_by: null,
          disabled: false,
          deleted_by_user_type: null
        };
        // console.log("postData", postData);

        this.vendorsService.addVendor(postData).then((res) => {

          // -----data save  in  user collection start-----
          let userPostData = {
            // id: res.id,
            uid: this.user_id,
            type: this.userType,
            image,
            name: data.name,
            // categoryLimitation: data.categoryLimitation,
            // productLimitation: data.productLimitation,
            name_arabic: data.name_arabic,
            email: data.email,
            city_id: data.city_id || [],
            categories: data.category || {},
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            created_by: this.uid,
            // _geoloc: this.location,

            deleted_at: null,
            deleted_by: null,
            disabled: false,
            deleted_by_user_type: null
          };
          // console.log("data", userPostData);

          let categoryIdArr = [];
          data.category.forEach((category => {
            categoryIdArr.push(category['cat_id']);
          }));
          const uniqueValues = categoryIdArr.some((val, i) => categoryIdArr.indexOf(val) !== i);
          if (uniqueValues == true) {
            console.log('duplicates found');
            this.validationService.sweetalertError('Duplicate category, please choose another');

          } else {
            console.log('duplicates not found');
            this.userService.addUser(userPostData).then(() => {
              console.log("User Data added successfully!");
            }).catch((err) => {
              console.log(err);
            });

            this.afs.collection("settings").doc('counts').update({
              'counts.vendors': firebase.firestore.FieldValue.increment(1)
            }).then((res) => {
              this.loading = false;
              this.saveLoading = false;
              this.validationService.sweetalertSuccess();
              this.router.navigate(['/vendors']);
            })
              .catch(() => {
                this.loading = false;
                this.saveLoading = false;
              });
          }
          // -----data save  in  user collection end-----

        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.saveLoading = false;
        });
      })
      .catch((error) => {
        console.log('error', error)
        this.validationService.sweetalertError(error.message);
        this.saveLoading = false;
      });
  }

}

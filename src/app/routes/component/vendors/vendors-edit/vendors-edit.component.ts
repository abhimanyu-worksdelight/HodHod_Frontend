import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { CategoryService } from '../../../services/category/category.service';
import { CitiesService } from '../../../services/cities/cities.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-vendors-edit',
  templateUrl: './vendors-edit.component.html',
  styleUrls: ['./vendors-edit.component.scss']
})
export class VendorsEditComponent implements OnInit {
  // ng2Select
  public cityItems: any = [];
  public value: any = {};
  public disabled: boolean = false;

  valForm: UntypedFormGroup;
  selectedFile: any;
  fileName: any;
  fileUrl: any;
  loading = false;
  id: any;
  vendorsDetailData: any;
  saveLoading: boolean = false;
  // location = {};
  Categories: any = [];
  category_id: string;

  // @ViewChild('addresstext') addresstext: any;

  constructor(
    private fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private route: ActivatedRoute,
    private vendorsService: VendorsService,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage,
    private categoryService: CategoryService,
    private citiesService: CitiesService
  ) {
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'name_arabic': '',
      'email': ['', Validators.required],
      // 'password': [''],
      'image': '',
      'isEnabled': [true, Validators.required],
      // 'address': [true, Validators.required],
      categoryArr: this.fb.array([]),
      'city_id': [false, Validators.required],
    });
  }

  emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.vendorsService.getVendorDetail(this.id).get().subscribe((res) => {
      if (res.exists) {
        this.vendorsDetailData = res.data();
        this.fileName = this.vendorsDetailData.image;
        this.fileUrl = this.vendorsDetailData.image;

        // if(this.vendorsDetailData._geoloc){
        //   this.location = {
        //     lat: this.vendorsDetailData._geoloc.lat,
        //     lng: this.vendorsDetailData._geoloc.lng,
        //     address: this.vendorsDetailData._geoloc.address,
        //   }
        //   // console.log("location", this.location);
        // }else{
        //   this.location = {}
        // }

        // console.log(this.vendorsDetailData);
        // console.log(this.vendorsDetailData['categories']);

        this.setCatgory();

      }
    });


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

  }

  getCitiesList() {
    this.citiesService.getCitiesList().subscribe(res => {
      this.cityItems = [];
      res.map(e => {
        let data: Object = e.payload.doc.data();
        let cityPostData = {
          text: data['name_english'],
          id: e.payload.doc.id,
        }
        this.cityItems.push(cityPostData);
      });
    });
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

  editVendor($ev, data) {
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
            this.updateStoreToDB(data, url);
          }
        });
      })).subscribe(url => {
        if (url) {
          this.loading = false;
        }
      });

    } else {
      if (this.valForm.valid) {
        this.updateStoreToDB(data, this.fileUrl);
      } else {
        console.log("this.valForm", this.valForm);
      }
    }
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.getPlaceAutocomplete();
    // }, 3000);
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
  //     console.log("location", this.location);
  //   });
  // }

  onChangeCategory(data) {
    this.category_id = data;
  }

  // category array start-----
  category(): UntypedFormArray {
    return this.valForm.controls.categoryArr as UntypedFormArray;
  }

  get controls() {
    return (this.valForm.get("categoryArr") as UntypedFormArray).controls;
  }

  setCatgory() {
    const category = this.valForm.controls.categoryArr as UntypedFormArray;

    this.vendorsDetailData['categories'].forEach(item => {
      category.push(this.fb.group({
        cat_id: item.cat_id,
        // currencyValue: item.currencyValue,
        // currencyType: item.currencyType,
        currencySarValue: item.currencySarValue,
        currencyPercentValue: item.currencyPercentValue,
        productLimitation: item.productLimitation,
      }));
    });
  }

  addCategory() {
    const category = this.valForm.controls.categoryArr as UntypedFormArray;

    category.push(this.fb.group({
      cat_id: '',
      // currencyValue: '',
      // currencyType: '%',
      currencySarValue: '',
      currencyPercentValue: '',
      productLimitation: '',
    }));
  }

  removeCategory(empIndex: number) {
    this.category().removeAt(empIndex);
  }
  // category array end-----

  updateStoreToDB(data, image) {
    this.saveLoading = true;

    if (data.name_arabic == undefined && data.name_arabic == null) data.name_arabic = '';

    let postData = {
      name: data.name,
      name_arabic: data.name_arabic,
      // categoryLimitation: data.categoryLimitation,
      // productLimitation: data.productLimitation,
      categories: data.categoryArr || {},
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      is_enabled: data.isEnabled,
      email: data.email,
      // password: data.password,
      city_id: data.city_id || [],
      // _geoloc: this.location,
      image,
    };
    console.log("postData", postData);

    let categoryIdArr = [];
    data.categoryArr.forEach((category => {
      categoryIdArr.push(category['cat_id']);
    }));
    const uniqueValues = categoryIdArr.some((val, i) => categoryIdArr.indexOf(val) !== i);
    if (uniqueValues == true) {
      console.log('duplicates found');
      this.loading = false;
      this.saveLoading = false;
      this.validationService.sweetalertError('Duplicate category, please choose another');

    } else {
      console.log('duplicates not found');
      this.vendorsService.updateVendor(this.id, postData).then(() => {
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
      }).catch((err) => {
        console.log(err);
        this.loading = false;
        this.saveLoading = false;
      });
    }
  }

}

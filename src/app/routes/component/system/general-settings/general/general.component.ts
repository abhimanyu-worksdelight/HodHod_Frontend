import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { GeneralSettingsService } from '../../../../services/system/general-settings/general-settings.service';

const swal = require('sweetalert');
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  valForm: UntypedFormGroup;
  valApppagesForm: UntypedFormGroup;
  
  generalActive = 1;

  downloadableURL: any;
  fileName: any;
  fileUrl: any;
  isAnableVideoAds: boolean = false;
  applicationLogoUrl: any;
  backofficeBigLogoUrl: any;
  backofficeSmallLogoUrl: any;
  emptyGiftImageUrl: any;
  emptyFoodImageUrl: any;
  GeneralData: any;
  GeneralEmail: any;
  AppPages: any = [];
  appPagesEdit: boolean = true;
  id: any;
  appPagesDataDetail: any = [];
  saveLoading: boolean = false;
  
  constructor( 
    fb: UntypedFormBuilder,
    private fireStorage: AngularFireStorage,
    private generalSettingsService: GeneralSettingsService
  ) { 
    this.valForm = fb.group({
      'applicationName': [null, Validators.required],
      'applicationName_arabic': '',
      'applicationLogo': '',
      'backofficeBigLogo': '',
      'backofficeSmallLogo': '',
      'androidVersionNumber': [null, Validators.required],
      'iosVersionNumber': [null, Validators.required],
      'newContactEmail': [null, Validators.required],
      'rightReservedText': [null, Validators.required],
      'rightReservedText_arabic': '',
      'googlePlayUrl': [null, Validators.required],
      'appleStoreUrl': [null, Validators.required],
      'phoneCountryCode': [null, Validators.required],
      'emptyGiftImage': '',
      'emptyFoodImage': '',
    });

    this.valApppagesForm = fb.group({
      'title': [null, Validators.required],
      'title_arabic': '',
      'description': [null, Validators.required],
      'description_arabic': '',
    })
  }

  ngOnInit(): void {
    // --------get general settings detail start---------
    this.generalSettingsService.getGeneralDetail('general').get().subscribe((doc) => {
      if (doc.exists) {
        this.GeneralData = doc.data();
        this.applicationLogoUrl = this.GeneralData.application_logo;
        this.backofficeBigLogoUrl = this.GeneralData.backoffice_big_logo;
        this.backofficeSmallLogoUrl = this.GeneralData.backoffice_small_logo;
        this.emptyGiftImageUrl = this.GeneralData.empty_gift_image;
        this.emptyFoodImageUrl = this.GeneralData.empty_food_image;
        this.isAnableVideoAds = this.GeneralData.isAnable_video_ads;
        // console.log("GeneralData", this.GeneralData);
      } else {
        console.log("No such document!");
      }
      },(error=>{
        console.log("error",error);
    }));
    // --------get general settings detail end---------

    // --------get general app pages list start-------
    this.generalSettingsService.getAppPagesList().subscribe(res => {
      this.AppPages = [];
      res.forEach( e => {
        this.AppPages.push(e.data());
      });
      // console.log("this.AppPages", this.AppPages);
    });
    // --------get general app pages list end---------
  }

  onFileChanged(event: any, type) {
    const file = event.target.files[0];
    var n = Date.now();
    const basePath = '/general-settings';
    const filePath = `${basePath}/${n}`;
    const fileRef = this.fireStorage.ref(filePath);
    const task = this.fireStorage.upload(`${basePath}/${n}`, file);
    task.snapshotChanges().pipe(finalize(() => {
      this.downloadableURL = fileRef.getDownloadURL();
      this.downloadableURL.subscribe(url => {
        if (url && type == "applicationLogo") { 
          this.applicationLogoUrl = url;

        }else if (url && type == "backofficeBigLogo") { 
          this.backofficeBigLogoUrl = url;

        }else if (url && type == "backofficeSmallLogo") { 
          this.backofficeSmallLogoUrl = url;

        }else if (url && type == "emptyGiftImage") { 
          this.emptyGiftImageUrl = url;

        }else if (url && type == "emptyFoodImage") { 
          this.emptyFoodImageUrl = url;
        }
      });
    })).subscribe(url => {
      if (url) {
        // console.log('No images selected', url);
      }
    });
  }

  onCheckboxChange(e) {
    if (e.target.checked) {
      this.isAnableVideoAds = true;
    } else {
      this.isAnableVideoAds = false;
    }
  }

  // add General Settings start------------------
  updateGeneralData($ev, formData){
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.saveLoading = true;

      // set empty array if data is blank
      let data = formData;
      if(typeof data.applicationName_arabic === undefined || data.applicationName_arabic === undefined || data.applicationName_arabic === null) data.applicationName_arabic = '';
      if(typeof data.rightReservedText_arabic === undefined || data.rightReservedText_arabic === undefined || data.rightReservedText_arabic === null) data.rightReservedText_arabic = '';

      let postData = {
        application_name: data.applicationName,
        application_name_arabic: data.applicationName_arabic,
        application_logo: this.applicationLogoUrl,
        backoffice_big_logo: this.backofficeBigLogoUrl,
        backoffice_small_logo: this.backofficeSmallLogoUrl,
        empty_gift_image: this.emptyGiftImageUrl,
        empty_food_image: this.emptyFoodImageUrl,
        android_version_number: data.androidVersionNumber,
        ios_version_number: data.iosVersionNumber,
        new_contact_email: data.newContactEmail,
        right_reserved_text: data.rightReservedText,
        right_reserved_text_arabic: data.rightReservedText_arabic,
        google_play_url: data.googlePlayUrl,
        apple_store_url: data.appleStoreUrl,
        phone_country_code: data.phoneCountryCode
      };
      // console.log("data", postData);
      this.generalSettingsService.updateGeneral('general', postData).then(() => {
        this.sweetalertSuccess();
        this.saveLoading = false;

      }).catch((err) => {
        console.log(err);
        this.saveLoading = false;
      });
    }
  }
  // add General Settings end------------------

  // edit app pages start------------------
  onEditAppPagesEditBtn(id, appPagesData){
    this.id = id;
    this.appPagesDataDetail = appPagesData;
    this.appPagesEdit = false;
  }
  onEditAppPagesCloseBtn(){
    this.appPagesEdit = true;
  }

  onEditAppPages($ev, data){
    $ev.preventDefault();
    for (let c in this.valApppagesForm.controls) {
      this.valApppagesForm.controls[c].markAsTouched();
    }
    if (this.valApppagesForm.valid) {
      let postData = {
        title: data.title,
        title_arabic: data.title_arabic,
        description: data.description,
        description_arabic: data.description_arabic,
      };
      // console.log("data", postData);
      this.generalSettingsService.updateAppPages(this.id, postData).then(() => {
        this.sweetalertSuccess();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  // edit app pages end------------------

  // success alert box
  sweetalertSuccess() {
    swal("Data update successfully!", "", "success");
  }
  
}

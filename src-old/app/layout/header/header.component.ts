import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HomeService } from '../../services/home/home.service';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import * as jquery from 'jquery';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ValidationService } from '../../services/validation/validation.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  // ng2Select
  public citiyItems: any = [];
  public value: any = {};
  public disabled: boolean = false;

  valLoginForm: FormGroup;
  valVerifyForm: FormGroup;
  loginSuccessfull: boolean = false;
  valRegisterForm: FormGroup;
  cityData: any = [];
  OTP: any = '';
  currentAddress: any = '';
  selectedAddress: any = '';
  userName: any;

  // country code input field
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required])
  });

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  constructor(
    fb: FormBuilder,
    private homeService: HomeService,
    private authService: AuthService,
    public router: Router,
    private afs: AngularFirestore,
    private validationService: ValidationService,
  ) {
    this.valRegisterForm = fb.group({
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'phone': '',
    });

    this.valLoginForm = fb.group({
      'phone': '',
    });

    this.valVerifyForm = fb.group({
      'otp': ''
    });
  }

  ngOnInit(): void {
    this.OTP = sessionStorage.getItem('otp');

    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    } else {
      this.userName = 'Guest';
    }

    this.homeService.getCityList().then((cityList) => {
      if (cityList) {
        this.citiyItems = [];
        this.cityData = [];
        for (let i = 0; i <= cityList.length; i++) {
          if (this.cityData) {
            this.cityData.push(cityList[i].data());
            this.citiyItems.push({
              id: cityList[i].id,
              text: cityList[i].data().name
            });
          }

          let currentCountry = localStorage.getItem('country');
          let currentState = localStorage.getItem('state');
          let currentCity = localStorage.getItem('city');

          // let value = cityData.data().name.split(",");
          // let country = value[value.length-1];
          // let state = value[value.length-2];
          // let city = value[value.length-3];

          if (cityList[i].data().name.includes(currentCountry) &&
            cityList[i].data().name.includes(currentState) &&
            cityList[i].data().name.includes(currentCity)) {
            this.selectedAddress = cityList[i].id;
            localStorage.setItem('selectedCityId', cityList[i].id);
            break;

          } else {
            this.selectedAddress = 'PTMLDUiLrIpv8a0agSmi';
            localStorage.setItem('selectedCityId', 'PTMLDUiLrIpv8a0agSmi');
          }
        }
        // console.log('cityData', this.cityData);
      }
    });
  }

  onChangeCity(city: any) {
    // console.log('city', city);
    localStorage.setItem('selectedCityId', city);
  }

  submitRegisterForm(data: any) {
    this.valLoginForm.reset();
    this.valVerifyForm.reset();

    if (this.valRegisterForm.valid) {
      let postData = {
        name: data.name,
        email: data.email,
        phone: data.phone.number,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      }
      // console.log('postData', postData);

      if (data.phone.number && data.phone.number.length == 10) {
        this.afs.collection("web_user", ref => ref.where('phone', '==', data.phone.number)).get().subscribe(user => {
          if (user.size) {
            this.validationService.sweetalertError('This number is already registered!');
          } else {
            this.afs.collection("web_user").add(postData).then((res) => {
              this.validationService.sweetalertNotificationSuccess('User registration successfull!');
              this.valRegisterForm.reset();
            }).catch((error) => {
              console.log('Something went wrong!', error);
            });
          }
        });
      } else {
        this.validationService.sweetalertError('Please enter a valid phone number!');
      }
    } else {
      console.log('this.valRegisterForm valid', this.valRegisterForm);
      this.validationService.sweetalertError('Please enter a valid phone number!');
    }
  }

  submitLoginForm(data: any) {
    this.valRegisterForm.reset();
    this.valVerifyForm.reset();
    if (this.valLoginForm) {
      if (data.phone.number && data.phone.number.length == 10) {
        this.afs.collection("web_user", ref => ref.where('phone', '==', data.phone.number)).get().subscribe((res) => {
          if (res.size) {
            console.log(" res.docs[0].data() ", res.docs[0].data())
            let userData: any = res.docs[0].data();
            this.loginSuccessfull = true;
            this.userName = userData.name;
            localStorage.setItem('userName', this.userName);
          } else {
            this.validationService.sweetalertError('Please, Register your phone number first!');
          }
        });
      } else {
        console.log('this.valLoginForm', this.valLoginForm);
        this.validationService.sweetalertError('Please enter a valid phone number!');
        this.loginSuccessfull = false;
      }
    }
  }

  submitVerifyForm(data: any) {
    this.valLoginForm.reset();
    this.valRegisterForm.reset();

    if (this.valVerifyForm.valid) {
      const otp = 12345;
      if (data.otp == otp) {
        sessionStorage.setItem('otp', otp.toString());
        $('.modal-backdrop').remove();
        $('body').css('overflow', 'auto');
        $("#authLogin").hide();
        this.loginSuccessfull = false;
        this.validationService.sweetalertNotificationSuccess('You are login successfull!');
        this.ngOnInit();

      } else {
        this.validationService.sweetalertError('Incorrect Otp, Please enter correct!');
      }
    }
  }

  onClickRegisterLink() {
    this.loginSuccessfull = false;
    this.valLoginForm.reset();
    this.valVerifyForm.reset();
  }
  onClickLoginLink() {
    this.loginSuccessfull = false;
    this.valRegisterForm.reset();
    this.valVerifyForm.reset();
  }

  logout() {
    this.authService.signout();
    this.ngOnInit();
    this.router.navigate(['home']);
  }

}

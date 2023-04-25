import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomeService } from '../../services/home/home.service';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import * as jquery from 'jquery';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ValidationService } from '../../services/validation/validation.service';
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

  constructor(
    fb: FormBuilder,
    private homeService: HomeService,
    private authService: AuthService,
    public router: Router,
    private afs: AngularFirestore,
    private validationService: ValidationService,
  ) { 
    this.valRegisterForm = fb.group({
      'name': [null,  Validators.required],
      'email': [null, Validators.required],
      'phone': [null, Validators.required]
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

    this.homeService.getCityList().then((cityList) => {
      if(cityList){
        cityList.forEach((cityData: any) => {
          this.cityData.push(cityData.data());
          this.citiyItems.push({
            id: cityData.id,
            text: cityData.data().name
          });

          let currentCountry = localStorage.getItem('country');
          let currentState = localStorage.getItem('state');
          let currentCity = localStorage.getItem('city');

          // let value = cityData.data().name.split(",");
          // let country = value[value.length-1];
          // let state = value[value.length-2];
          // let city = value[value.length-3];

          if(cityData.data().name.includes(currentCountry) && 
          cityData.data().name.includes(currentState) &&
          cityData.data().name.includes(currentCity) &&
          cityData.data().name.includes(currentCity)){
            this.selectedAddress = cityData.id;
            localStorage.setItem('selectedCityId', cityData.id);

          }else if(cityData.data().name.includes(currentCountry) && 
          cityData.data().name.includes(currentState) &&
          cityData.data().name.includes(currentCity)){
            this.selectedAddress = cityData.id;
            localStorage.setItem('selectedCityId', cityData.id);

          }else if(cityData.data().name.includes(currentCountry)){
            this.selectedAddress = cityData.id;
            localStorage.setItem('selectedCityId', cityData.id);
          }
          
        });
        // console.log('cityData', this.cityData);
      }
    });
  }

  onChangeCity(city: any) {    
    // console.log('city', city);
    localStorage.setItem('selectedCityId', city);
  }

  submitRegisterForm(data: any) {
    if (this.valRegisterForm.valid) {
      let postData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      }
      // console.log('postData', postData);

      this.afs.collection("web_user").add(postData).then((res) => {
        this.validationService.sweetalertNotificationSuccess('User registration successfull!');

      }).catch((error) => {
        console.log('Something went wrong!', error);
      });
    }
  }

  submitLoginForm(data: any) {
    if (this.valLoginForm.valid && data.phone) {
      if(data.phone && data.phone.toString().length == 10) {
        this.afs.collection("web_user", ref => ref.where('phone', '==', data.phone)).get().subscribe((res) => {
          if(res.size){
            this.loginSuccessfull = true;
          }else{
            this.validationService.sweetalertError('Please, Register your phone number first!');
          }

        });
      }else{
        this.validationService.sweetalertError('Please enter a valid phone number!');
        this.loginSuccessfull = false;
      }
    }
  }

  submitVerifyForm(data: any){
    if (this.valVerifyForm.valid) {
      const otp = 12345;
      if(data.otp == otp){
        sessionStorage.setItem('otp', otp.toString());
        $('.modal-backdrop').remove();
        $('body').css('overflow', 'auto');
        $("#authLogin").hide();
        this.loginSuccessfull = false;
        this.validationService.sweetalertNotificationSuccess('You are login successfull!');
        this.ngOnInit();

      }else{
        this.validationService.sweetalertError('Incorrect Otp, Please enter correct!');
      }
    }
  }

  onClickRegisterLink(){
    this.loginSuccessfull = false;
  }
  onClickLoginLink(){
    this.loginSuccessfull = false;
  }

  logout(){
    this.authService.signout();
    this.ngOnInit();
    this.router.navigate(['home']);
  }

}

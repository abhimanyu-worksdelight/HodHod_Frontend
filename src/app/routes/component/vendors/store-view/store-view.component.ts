import { Component, OnInit, ViewChild, EventEmitter, Output, AfterViewInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { ShopsService } from '../../../services/shops/shops.service';
import { VendorsService } from '../../../services/vendors//vendors.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { finalize } from 'rxjs/operators';
import { MouseEvent } from '@agm/core';
import { CitiesService } from '../../../services/cities/cities.service';

let city;
let state;
let country;

// agm maps start----
//just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})
export class StoreViewComponent implements OnInit {

  // agm maps start----
  // agm maps start----
  zoom: number = 8;
  // initial center position for the map
  lat: number = 36.2391303;
  lng: number = -113.769382;
  markers: marker[];
  pickedAddress: string;
  loginType: string;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    // console.log('dragEnd', m, $event);
    this.location = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      address: m.label,
    }
    this.pickedAddress = m.label;
    // console.log("location", this.location);

    this.getReverseGeocodingData($event.coords.lat, $event.coords.lng);
  }

  getReverseGeocodingData(lat, lng) {
    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({ location: latlng }, (results, status) => {

        if (status === google.maps.GeocoderStatus.OK) {
          let result = results[0];

          if (result != null) {
            // console.log("result", result);
            // console.log("result.formatted_address", result.formatted_address);

            // set data in markers on maps
            this.setMapsData(lat, lng, result.formatted_address);

            result.address_components.forEach((address) => {
              address.types.forEach((type) => {
                if(type == 'locality'){
                  city = address.long_name;
                }
      
                if(type == 'administrative_area_level_1'){
                  state = address.long_name;
                }
      
                if(type == 'country'){
                  country = address.long_name;
                }
              });
            });

            // set data for data in database
            this.location = {
              lat: lat,
              lng: lng,
              address: result.formatted_address,
              custom_address: city+', '+state+', '+country,
              city_id: this.city_id,
            }
            // console.log('this.location', this.location);

          } else {
            console.log('No address available!');
          }
        }
      });
    }
  }
  
  setMapsData(lat, lng, address){
    this.markers = [
      {
        lat: lat,
        lng: lng,
        label: address,
        draggable: true,
      },
    ]
  }
  // agm maps end------

  valForm: UntypedFormGroup;
  selectedFile: any
  loading = false;
  id: any;
  fileName: any;
  fileUrl: any;
  vendorsList: any[];
  cityList: any = [];
  vendor_id: string;
  city_id: string;
  shopDetailData: any;
  location = {};
  saveLoading: boolean = false;
  fileloading: boolean = false;

  // public working_hours: any = [
  //   {
  //     day: 'Monday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  //   {
  //     day: 'Tuesday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  //   {
  //     day: 'Wednesday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  //   {
  //     day: 'Thursday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  //   {
  //     day: 'Friday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  //   {
  //     day: 'Saturday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  //   {
  //     day: 'Sunday',
  //     open: false,
  //     open_time: '8:00',
  //     close_time: '21:00'
  //   },
  // ];

  @ViewChild('addresstext') addresstext: any;

  constructor(
    fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private route: ActivatedRoute,
    private shopsService: ShopsService,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage,
    private vendorsService: VendorsService,
    private citiesService: CitiesService
  ) {
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'name_arabic': '',
      'address': ['', Validators.required],
      'image': '',
      'isEnabled': [true, Validators.required],
      'vendor_id':  [true, Validators.required],
      'city_id':  [true, Validators.required],
      // 'isDelivery': [false, Validators.required],

      'isMonday': [false, Validators.required],
      'isTuesday': [false, Validators.required],
      'isWednesday': [false, Validators.required],
      'isThursday': [false, Validators.required],
      'isFriday': [false, Validators.required],
      'isSaturday': [false, Validators.required],
      'isSunday': [false, Validators.required],

      'monday_open_time': '',
      'tuesday_open_time': '',
      'wednesday_open_time': '',
      'thursday_open_time': '',
      'friday_open_time': '',
      'saturday_open_time': '',
      'sunday_open_time': '',

      'monday_close_time': '',
      'tuesday_close_time': '',
      'wednesday_close_time': '',
      'thursday_close_time': '',
      'friday_close_time': '',
      'saturday_close_time': '',
      'sunday_close_time': '',
    });
  }

  ngOnInit(): void {
    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.vendorsService.getVendorsList().subscribe(res => {
      this.vendorsList = res.map(e => {
        let data: Object = e.payload.doc.data()
        return {
          id: e.payload.doc.id,
          ...data
        }
      })
    });

    this.id = this.route.snapshot.params['id'];

    this.shopsService.getShopDetail(this.id).get().subscribe((res) => {
      if(res.exists){
        this.shopDetailData = res.data();
        this.fileName = this.shopDetailData.image;
        this.fileUrl = this.shopDetailData.image;
        this.vendor_id = this.shopDetailData.vendor_id;
        // console.log("this.shopDetailData", this.shopDetailData);

        if(this.shopDetailData.location){
          this.location = {
            lat: this.shopDetailData.location.lat,
            lng: this.shopDetailData.location.lng,
            address: this.shopDetailData.location.address,
            custom_address: this.shopDetailData.location.custom_address,
            city_id: this.shopDetailData.location.city_id,
          }
          if(this.shopDetailData.vendor_id) { this.getSelectedCity(this.shopDetailData.vendor_id); }

          // show created marker of database
          this.markers = [
            {
              lat: this.shopDetailData.location.lat,
              lng: this.shopDetailData.location.lng,
              label: this.shopDetailData.location.address,
              draggable: true,
            },
          ]

          // set current position
          this.lat = this.shopDetailData.location.lat;
          this.lng = this.shopDetailData.location.lng;
          this.pickedAddress = this.shopDetailData.location.address;
        }
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getPlaceAutocomplete();
    }, 5000);
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        // componentRestrictions: { country: ['IND', 'US', 'AE', 'SA'] },
        componentRestrictions: { country: ['SA'] },
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();

      place.address_components.forEach((address) => {
        address.types.forEach((type) => {
          if(type == 'locality'){
            city = address.long_name;
          }

          if(type == 'administrative_area_level_1'){
            state = address.long_name;
          }

          if(type == 'country'){
            country = address.long_name;
          }
        });
      });
      
      this.location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
        custom_address: city+', '+state+', '+country,
        zoom: 12,
        city_id: this.city_id,
      }
      // console.log("this.location", this.location, place, this.location['address']);

      // set data in markers on maps
      this.setMapsData(this.location['lat'], this.location['lng'], place);

      // rezoom location on maps
      this.recenterMap(this.location['lat'], this.location['lng']);
    });
  }

  recenterMap(lat, lng){
    this.lat = lat;
    this.lng = lng;
  }

  onFileChanged(event: any) {
    this.fileloading = true;
    if (event) {
      this.selectedFile = event.target.files[0];
      this.fileUrl = this.selectedFile.src;
      
      if (this.selectedFile.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); 
      reader.onload = (_event) => { 
        this.fileUrl = reader.result;
        this.fileloading = false;
      }
    }else{
      this.fileloading = false;
    }
  }

  onChangeVendor(data) {
    this.vendor_id = data;
    // console.log('$event', data);
    
    this.cityList = [];
    this.getSelectedCity(data);
  }

  getSelectedCity(vendorId){
    if(vendorId){
      var slectedVendor = this.vendorsList.find(item => item.id == vendorId);
      if(slectedVendor['city_id']){
        slectedVendor['city_id'].forEach(cId => {
          this.afs.collection("cities", ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', cId)).snapshotChanges().subscribe((cityRes) => {
            cityRes.map(item => {
              const cityArr = {
                id: item.payload.doc.id,
                data: item.payload.doc.data()
              }
              this.cityList.push(cityArr);
              this.cityList = [...new Set(this.cityList)];
            });
          });
        });
      }
    }
  }

  onChangeCity(data) {
    this.city_id = data;
    // console.log('$event', data);
  }

  editProduct($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    // if (this.valForm.valid && this.selectedFile) {
    //   this.loading = true;
    //   const file = this.selectedFile;
    //   const now = Date.now();
    //   const basePath = '/shops';
    //   const filePath = `${basePath}/${now}-${file.name}`;
    //   const fileRef = this.fireStorage.ref(filePath);
    //   const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
    //   task.snapshotChanges().pipe(finalize(() => {
    //     const downloadUrl = fileRef.getDownloadURL();
    //     downloadUrl.subscribe(url => {
    //       if (url) {
    //         this.fileUrl = url;
    //         this.updateStoreToDB(data, url)
    //       }
    //     });
    //   })).subscribe(url => {
    //     if (url) {
    //       this.loading = false;
    //     }
    //   });
    // }else if (this.valForm.valid){
    //   this.updateStoreToDB(data, this.fileUrl);
    // }
    if (this.valForm.valid){
      this.updateStoreToDB(data);
    }
  }

  /**
  * @param data 
  * @param image 
  */

  // updateStoreToDB(data, image) {
  updateStoreToDB(data) {
    this.saveLoading = true;

    // this.working_hours = [
    //   {
    //     day: 'Monday',
    //     open: data.isMonday,
    //     open_time: data.monday_open_time,
    //     close_time: data.monday_close_time
    //   },
    //   {
    //     day: 'Tuesday',
    //     open: data.isTuesday,
    //     open_time: data.tuesday_open_time,
    //     close_time: data.tuesday_close_time
    //   },
    //   {
    //     day: 'Wednesday',
    //     open: data.isWednesday,
    //     open_time: data.wednesday_open_time,
    //     close_time: data.wednesday_close_time
    //   },
    //   {
    //     day: 'Thursday',
    //     open: data.isThursday,
    //     open_time: data.thursday_open_time,
    //     close_time: data.thursday_close_time
    //   },
    //   {
    //     day: 'Friday',
    //     open: data.isFriday,
    //     open_time: data.friday_open_time,
    //     close_time: data.friday_close_time
    //   },
    //   {
    //     day: 'Saturday',
    //     open: data.isSaturday,
    //     open_time: data.saturday_open_time,
    //     close_time: data.saturday_close_time
    //   },
    //   {
    //     day: 'Sunday',
    //     open: data.isSunday,
    //     open_time: data.sunday_open_time,
    //     close_time: data.sunday_close_time
    //   },
    // ];
    
    let postData = {
      name: data.name,
      name_arabic: data.name_arabic,
      location: this.location,
      vendor_id: this.vendor_id,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      is_enabled: data.isEnabled,
      // is_delivery: data.isDelivery,
      is_delivery: false,
      // image,
      // working_hours: this.working_hours,
    };
    // console.log("postData", postData);

    this.shopsService.updateShop(this.id, postData).then(() => {

      // add cities in cities collection start--------
      if(this.location['custom_address']){
        let postCityData = {
          original_loc: this.location['custom_address'],
          latitude: this.location['lat'],
          longitude: this.location['lng'],
          city_id: this.city_id,
          name_english: '--',
          name_arabic: '--',
          is_enabled: false,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // console.log('postCityData', postCityData);

        this.afs.collection("cities", ref => ref.where('original_loc', '==', this.location['custom_address']).limit(1)).get().subscribe(res => {
          if(res.size <= 0){
            this.citiesService.addCities(postCityData).then(() => {
              this.saveLoading = false;
              this.validationService.sweetalertSuccess();
                
            }).catch((err) => {
              this.saveLoading = false;
            });

          }else{
            console.log('City already entered!');
            return false;
          }
        });
      }
      // add cities in cities collection end----------
      
      this.afs.collection("settings").doc('counts').update({
        'counts.vendors': firebase.firestore.FieldValue.increment(1)
      }).then((res) => {
        this.loading = false;
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/shops']);

      }).catch((error) => {
        this.loading = false;
        this.saveLoading = false;
      });
      
    }).catch((err) => {
      this.loading = false;
    });
  }
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CitiesService } from '../../../services/cities/cities.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

let city = '';
let state;
let country;
@Component({
  selector: 'app-city-add',
  templateUrl: './city-add.component.html',
  styleUrls: ['./city-add.component.scss']
})
export class CityAddComponent implements OnInit {
  @ViewChild('citytext') citytext: any;

  valForm: UntypedFormGroup;

  saveLoading: boolean = false;
  pickedCity: string;
  location = {};
  autofillCity:string ='';
  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private citiesService: CitiesService,
    private afs: AngularFirestore,
    public router: Router,
  ) {
    this.valForm = fb.group({
      'city': ['', Validators.required],
      'city_english': ['', Validators.required],
      'city_arabic': [''],
      'isEnabled': [true, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {

    const autocomplete = new google.maps.places.Autocomplete(this.citytext.nativeElement,
      {
        // componentRestrictions: { country: ['IND', 'US', 'AE', 'SA'] },
        componentRestrictions: { country: ['SA'] },
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();

      place.address_components.forEach((address) => {
        address.types.forEach((type) => {
          if (type == 'locality') {
            city = address.long_name;
            this.autofillCity = city;
          }

          if (type == 'administrative_area_level_1') {
            state = address.long_name;
          }

          if (type == 'country') {
            country = address.long_name;
          }

          console.log("type...." + city + ' ' + state + ' ' + country);

        });
      });

      this.location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        // address: place.formatted_address,
        address: city + ', ' + state + ', ' + country,
        zoom: 12
      }
      // console.log("this.location", this.location);
    });
  }

  addCity($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      console.log("city_english"+data.city_english);
      let postData = {
        original_loc: this.location['address'],
        latitude: this.location['lat'],
        longitude: this.location['lng'],
        name_english: data.city_english,
        name_arabic: data.city_arabic,
        is_enabled: data.isEnabled,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.afs.collection("cities", ref => ref.where('original_loc', '==', this.location['address']).limit(1)).get().subscribe(res => {
        if (res.size <= 0) {
          this.citiesService.addCities(postData).then(() => {
            this.saveLoading = false;
            this.validationService.sweetalertSuccess();
            this.router.navigate(['/cities']);

          }).catch((err) => {
            this.saveLoading = false;
          });

        } else {
          this.validationService.sweetalertError("City already entered!");
        }
      });

    } else {
      console.log("this.valForm", this.valForm);
    }
  }

}

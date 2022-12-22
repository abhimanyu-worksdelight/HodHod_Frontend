import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CitiesService } from '../../../services/cities/cities.service';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/firestore';

let city;
let state;
let country;
@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent implements OnInit {

  @ViewChild('citytext') citytext: any;
  
  valForm: UntypedFormGroup;

  saveLoading: boolean = false;
  id: string;
  location = {};
  cityDetailData: any = [];

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private citiesService :CitiesService,
    public router: Router,
    private route: ActivatedRoute,
  ) { 
    this.valForm = fb.group({
      'city': ['', Validators.required],
      'city_english': ['', Validators.required],
      'city_arabic': [''],
      'isEnabled': [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.citiesService.getCitiesDetail(this.id).get().subscribe((res) => {
      if(res.exists){
        this.cityDetailData = res.data();
        // console.log("this.cityDetailData", this.cityDetailData);

        if(this.cityDetailData){
          this.location = {
            lat: this.cityDetailData.latitude,
            lng: this.cityDetailData.longitude,
            address: this.cityDetailData.name
          }
        }
      }
    });
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
      })

      this.location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        // address: place.formatted_address,
        address: city+', '+state+', '+country,
        zoom: 12
      }
      // console.log("this.location", this.location);
    });
  }

  editCity($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      let postData = {
        original_loc: this.location['address'],
        latitude: this.location['lat'],
        longitude: this.location['lng'],
        name_english: data.city_english,
        name_arabic: data.city_arabic,
        is_enabled: data.isEnabled,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.citiesService.updateCities(this.id, postData).then(() => {
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/cities']);
          
      }).catch((err) => {
        this.saveLoading = false;
      });

    }else{
      console.log("this.valForm", this.valForm);
    }
  }

}

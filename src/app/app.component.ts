import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- <app-header></app-header> -->
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'giftto';
  lat: any;
  lng: any;

  constructor() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        this.getReverseGeocodingData(this.lng, this.lat);
      });
    }
  }

  // get city name by latitude and longitude
  getReverseGeocodingData(lat: any, lng: any) {
    if (this.lat, this.lng) {
      // const latlng = new google.maps.LatLng(this.lat, this.lng);
      // let geocoder: any;
      // geocoder = new google.maps.Geocoder();
      // geocoder.geocode({ 'latLng': latlng }, function (results: any, status: any) {
      //   if (status == google.maps.GeocoderStatus.OK) {
      //     if (results[1]) {
      //       let currentAddress = results[0];
      //       currentAddress.address_components.forEach((address: any) => {
      //         if(address.types.includes('country')){
      //           localStorage.setItem('country', address.long_name);
      //         }
      //         if(address.types.includes('administrative_area_level_1')){
      //           localStorage.setItem('state', address.long_name);
      //         }
      //         if(address.types.includes('administrative_area_level_2')){
      //           localStorage.setItem('city', address.long_name);
      //         }
      //       });
      //     }
      //   }
      // });
    }
  }

}

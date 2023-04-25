import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
// import { MouseEvent } from '@agm/core';
// import { google } from "google-maps";
import { AuthService } from '../../authentication/auth.service';

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
  // agm maps start----
  zoom: number = 12;
  lat: number = 36.2391303;
  lng: number = -113.769382;
  markers: any = [];
  pickedAddress: any;
  location = {};
  OTP: any = '';
  centerPosition: object = {
    latitude: 36.2391303,
    longitude: -113.769382
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  setMapsData(lat: any, lng: any, address: any) {
    this.markers = [
      {
        lat: lat,
        lng: lng,
        label: address,
        draggable: true,
      },
    ]
    // console.log('this.markers', this.markers);
  }
  // agm maps end------


  id: string = '';
  quantity: any = 1;
  productDetail: any = [];
  shopData: any = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // get id and quantity from url
    this.id = this.route.snapshot.params['id'];
    this.quantity = this.route.snapshot.params['quantity'];

    this.homeService.getProductDetail(this.id).then((doc) => {
      if (doc) {
        this.productDetail = doc[0];
        // console.log('this.productDetail', this.productDetail);
      }
    });
  }

  increment() {
    this.quantity = ++this.quantity;
    // console.log('this.quantity', this.quantity);
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity = --this.quantity;
      // console.log('this.quantity', this.quantity);
    }
  }

  getMapData(ids: any) {
    ids.forEach((id: any) => {
      this.afs.collection('shops', ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id)).get().subscribe(res => {
        res.forEach(item => {
          this.shopData.push({
            id: item.id,
            data: item.data()
          });
        });
        // console.log('this.shopData', this.shopData);

        // set markers on map
        this.shopData.forEach((shopItem: any, i: number) => {
          this.setMapsData(shopItem.data.location.lat, shopItem.data.location.lng, shopItem.data.location.address);
          this.centerPosition = {
            latitude: this.shopData[i].data.location.lat,
            longitude: this.shopData[i].data.location.lng
          }
          console.log('this.centerPosition', this.centerPosition);
        });

      });
    });
  }

  logout() {
    this.authService.signout();
  }

}

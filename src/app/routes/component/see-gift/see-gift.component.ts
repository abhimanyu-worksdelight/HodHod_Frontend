import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';

@Component({
  selector: 'app-see-gift',
  templateUrl: './see-gift.component.html',
  styleUrls: ['./see-gift.component.scss']
})
export class SeeGiftComponent implements OnInit {

  // qr code
  public qrCodeData: string = null;
  url: any;
  order_id: string;
  orders: any = [];
  unique_Identifier: any;
  left_days: any;
  product_image: any;
  sender_name: any;
  description: string;
  gifImage: string;
  pin: string;
  isLoading: boolean = false;
  constructor(
    public router: Router,
    private afs: AngularFirestore
  ) {
    // qr code
    this.qrCodeData = 'Your QR code data string';
  }

  ngOnInit(): void {
    // get order id from url
    this.isLoading = true;
    this.order_id = window.location.href.split('?')[0].split('/').pop();
    // console.log(this.order_id);

    if (this.order_id) {
      this.afs.collection("orders").doc(this.order_id).get().subscribe((doc) => {
        this.orders = doc.data();

        if (this.orders) {
          this.unique_Identifier = doc.id;

          var expiry_date = moment(moment(this.orders.expiry).format('DD-MM-YYYY'), 'DD-MM-YYYY');
          var current_date = moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY');

          this.left_days = expiry_date.diff(current_date, 'days');

          if (this.qrCodeData == undefined || this.qrCodeData == '') {
            this.qrCodeData = "Empty data";
          } else {
            const qrData = {
              id: doc.id,
              expiry: this.orders.expiry
            }
            // this.qrCodeData = JSON.stringify(qrData);
            this.qrCodeData = JSON.stringify(doc.id);
          }

          if (this.orders.gift_sender) {
            this.afs.collection('users').doc(this.orders.gift_sender).get().subscribe((userDoc) => {
              this.sender_name = userDoc.data()['name'];
            });
          }

          // if(this.orders.product_id){
          //   this.afs.collection('products').doc(this.orders.product_id).get().subscribe((productDoc) => {
          //     this.product_image = productDoc.data()['image'];
          //     this.description = productDoc.data()['description']
          //   });
          // }
          if (this.orders.qr_code) {
            this.afs.collection('orders').doc(this.orders.qr_code).get().subscribe((productDoc) => {
              this.product_image = productDoc.data()['itemInfo']['image'];
              this.description = productDoc.data()['itemInfo']['description']
              this.pin = productDoc.data()['activationPin']
              var occId = productDoc.data()['occasion_id']
              this.afs.collection('occasions').doc(occId).get().subscribe((occasionData) => {
                this.gifImage = occasionData.data()['gif'];
              });
            });
          }
          setTimeout(() => {
            this.isLoading = false;

          }, 2000)
        }
        // console.log('this.orders', this.orders);
      });
    }
  }

}

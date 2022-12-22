import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-got-gift',
  templateUrl: './got-gift.component.html',
  styleUrls: ['./got-gift.component.scss']
})
export class GotGiftComponent implements OnInit {
  order_id: string;
  orders: any = [];
  public qrCodeData: string = null;
  gifImage: any = '';
  url: any;
  unique_Identifier: any;
  left_days: any;
  product_image: any;
  sender_name: any;
  description: string;
  pin: string;
  isLoading: boolean = false;
  constructor(
    public router: Router,
    private afs: AngularFirestore

  ) { }

  // ngOnInit(): void {
  //   // this.url = 'http://localhost:4200/#/got-gift?id=8cD2E8mit0PdYIkdKkh0';
  //   // this.order_id = this.url.split("=").pop();
  //   // this.order_id = '8cD2E8mit0PdYIkdKkh0';

  //   // get order id from url
  //   this.order_id = window.location.href.split("=").pop();
  //   console.log('order_id', this.order_id);
  //   if (this.order_id) {
  //     this.afs.collection("orders").doc(this.order_id).get().subscribe((doc) => {
  //       this.orders = doc.data();
  //       if (this.orders) {
  //         if (this.qrCodeData == undefined || this.qrCodeData == '') {
  //           this.qrCodeData = "Empty data";
  //         } else {
  //           const qrData = {
  //             id: doc.id,
  //             expiry: this.orders.expiry
  //           }
  //           // this.qrCodeData = JSON.stringify(qrData);
  //           this.qrCodeData = JSON.stringify(doc.id);
  //         }
  //         if (this.orders.qr_code) {
  //           this.afs.collection('orders').doc(this.orders.qr_code).get().subscribe((productDoc) => {
  //             var occasionId = productDoc.data()['occasion_id'];

  //             this.afs.collection('occasions').doc(occasionId).get().subscribe((occasionData) => {
  //               this.gifImage = occasionData.data()['gif'];
  //               setTimeout(() => {
  //                 console.log('in got gift');
  //                 this.router.navigate(['claim-gift', this.order_id]);
  //               }, 3000)
  //             });



  //             setTimeout(() => {
  //               console.log('in got gift');
  //               this.router.navigate(['claim-gift', this.order_id]);
  //             }, 3000)
  //           });
  //         }
  //       }
  //     });
  //   }

  // }
  ngOnInit(): void {
    // get order id from url
    this.isLoading = true;
    // this.order_id = window.location.href.split('?')[0].split('/').pop();
    this.order_id = window.location.href.split("=").pop();

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
          }, 5000)
        }
        // console.log('this.orders', this.orders);
      });
    }
  }
}

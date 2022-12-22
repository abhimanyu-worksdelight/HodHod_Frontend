import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

const swal = require('sweetalert');

import * as moment from 'moment';
@Component({
  selector: 'app-dashboard-vendor',
  templateUrl: './dashboard-vendor.component.html',
  styleUrls: ['./dashboard-vendor.component.scss']
})
export class DashboardVendorComponent implements OnInit {

  Users: any=[];
  limitedProducts: any[];
  loginType: string;
  uid: string;
  totalProduct: number;
  totalItemSold: number;
  totalRedeemedGifts: number;
  totalEarnings: number;

  constructor(
      private afs: AngularFirestore,
  ) {}

  ngOnInit() { 

    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
      if(venRes.length){
        venRes.map( ve => {
          // console.log("venRes", ve.payload.doc.id);

          this.afs.collection("shops", ref => ref.where('vendor_id', "==", ve.payload.doc.id)).snapshotChanges().subscribe(storeRes => {
            if(storeRes.length){
              storeRes.map( se => {
            
                this.afs.collection('products', ref => ref.where('store_id', "array-contains", se.payload.doc.id).limit(5)).snapshotChanges().subscribe(res => {
                  if(res.length){
                    this.totalProduct = res.length;
                    // console.log("this.totalProduct", this.totalProduct);
                  }
                });
              });
            }
          });
        });
      }
    });

    this.afs.collection("orders", ref => ref.where("redeem_status.is_redeemed", "==", true)).snapshotChanges().subscribe(ordRes => {
      if(ordRes.length){
        this.totalRedeemedGifts = ordRes.length;

        ordRes.map(ord => {
          this.afs.collection("shops", ref => ref.where('product_id', "==", ord.payload.doc.data()['product_id'])).snapshotChanges().subscribe(storeRes => {
            if(storeRes.length){

              storeRes.map( se => {
                this.afs.collection('products', ref => ref.where('store_id', "array-contains", se.payload.doc.id)).snapshotChanges().subscribe(res => {
                  if(res.length){
                    this.totalItemSold = res.length;
                  }
                });
              });
            }
          });
        });
      }
    }); 

    if(this.loginType == 'u7GeGmO2luLmkOMKeZ0k'){

      this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
        if(venRes.length){
          venRes.map( ve => {
            // console.log("venRes", ve.payload.doc.id);

            this.afs.collection("shops", ref => ref.where('vendor_id', "==", ve.payload.doc.id)).snapshotChanges().subscribe(storeRes => {
              if(storeRes.length){
                storeRes.map( se => {
              
                  this.afs.collection('products', ref => ref.where('store_id', "array-contains", se.payload.doc.id).limit(5)).snapshotChanges().subscribe(res => {
                    this.limitedProducts = [];
                    this.limitedProducts = res.map( e => {
                        
                      let data: Object = e.payload.doc.data()

                      if(data['created_at']) {
                        if(typeof data['created_at'] === 'string') {
                          data['created_at'] = moment(parseInt(data['created_at'])).format('DD-MM-YYYY LT');
                        }else {
                          data['created_at'] = moment(data['created_at'].toDate()).format('DD-MM-YYYY LT');
                        }
                      }

                      return {
                        id: e.payload.doc.id, 
                        ...data
                      }
                    })
                  });
                });
              }
            });
          });
        }
      });

    }else{
      this.afs.collection('products', ref => ref.limit(5)).snapshotChanges().subscribe(res => {
        this.limitedProducts = [];
        this.limitedProducts = res.map( e => {
            
          let data: Object = e.payload.doc.data()

          if(data['created_at']) {
            if(typeof data['created_at'] === 'string') {
              data['created_at'] = moment(parseInt(data['created_at'])).format('DD-MM-YYYY LT');
            }else {
              data['created_at'] = moment(data['created_at'].toDate()).format('DD-MM-YYYY LT');
            }
          }

          return {
            id: e.payload.doc.id, 
            ...data
          }
        })
      });
    }
  }
}

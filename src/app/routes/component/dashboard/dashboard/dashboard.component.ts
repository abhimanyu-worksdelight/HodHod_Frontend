import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

const swal = require('sweetalert');

import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Users: any = [];
  limitedProducts: any[];
  limitedCategories: any[];
  counts: any;
  totalRedeemedGifts: number = 0;
  constructor(
    private userService: UserService,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit() {

    const counts = this.afs.collection('settings').doc('counts').valueChanges()
    counts.subscribe(data => {
      this.counts = data['counts']
    })
    this.afs.collection("orders", ref => ref.where("redeem_status.is_redeemed", "==", true)).snapshotChanges().subscribe(ordRes => {
      this.totalRedeemedGifts = ordRes.length;

    });

    this.afs.collection('categories', ref => ref.limit(5).orderBy('updated_at', 'desc')).snapshotChanges().subscribe(res => {
      this.limitedCategories = [];
      this.limitedCategories = res.map(e => {

        let data: Object = e.payload.doc.data();

        if (data['created_at']) {
          if (typeof data['created_at'] === 'string') {
            data['created_at'] = moment(parseInt(data['created_at'])).format('DD-MM-YYYY LT');
          } else {
            data['created_at'] = moment(data['created_at'].toDate()).format('DD-MM-YYYY LT');
          }
        }

        return {
          id: e.payload.doc.id,
          ...data
        }
      })
    });

    this.afs.collection('products', ref => ref.limit(5)).snapshotChanges().subscribe(res => {
      this.limitedProducts = [];
      this.limitedProducts = res.map(e => {

        let data: Object = e.payload.doc.data()

        if (data['created_at']) {
          if (typeof data['created_at'] === 'string') {
            data['created_at'] = moment(parseInt(data['created_at'])).format('DD-MM-YYYY LT');
          } else {
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
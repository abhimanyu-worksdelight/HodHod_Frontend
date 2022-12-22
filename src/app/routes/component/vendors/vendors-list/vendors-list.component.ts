import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import "firebase/functions";

const swal = require('sweetalert');
import * as moment from 'moment';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class VendorsListComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Vendors: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  loginType: string;
  arrayTableData: any = [];
  sr_no: number;
  isLoading: boolean = false;

  constructor(
    private vendorsService: VendorsService,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    // get vendor listing data
    this.getVendorsListingData();
  }

  getVendorsListingData() {
    this.vendorsService.getVendorsList().subscribe(res => {
      this.isLoading = true;
      this.rowsFilter = [];
      this.arrayRowData = [];
      this.Vendors = [];
      this.arrayTableData = [];

      if (res.length) {
        this.Vendors = res.map(e => {
          let data = e.payload.doc.data()

          return {
            id: e.payload.doc.id,
            data
          }
        });

        for (let i = 0; i < this.Vendors.length; i++) {
          this.arrayRowData = this.Vendors[i].data;
          this.arrayRowData.sr_no = i + 1;
          this.arrayRowData.id = "VND:" + this.Vendors[i].id;
          this.arrayTableData.push(this.arrayRowData);
          this.isLoading = false;

          //convert created_at in required date format ---- start
          if (this.arrayRowData.created_at) {
            if (typeof this.arrayRowData.created_at === 'string') {
              this.arrayRowData.created_at = moment(parseInt(this.arrayRowData.created_at)).format('DD-MM-YYYY LT');
            } else {
              this.arrayRowData.created_at = moment(this.arrayRowData.created_at.toDate()).format('DD-MM-YYYY LT');
            }
          }
          //convert created_at in required date format ---- end


        }
        this.rowsFilter = this.arrayTableData;

      } else {
        this.isLoading = false;
      }
    });
  }

  // search datatable data start--------------
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.arrayTableData.filter(function (d) {
      if (d.name != '' && d.name != null) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.rowsFilter = temp;
    this.table.offset = 0;
  }

  /*
  * 
  * @param id 
  * 
  */

  deleteVendorsData(uid, id) {
    const updateVendorsData = {
      deleted_at: firebase.firestore.FieldValue.serverTimestamp(), //date and time
      deleted_by: uid, // id
      disabled: false,
      deleted_by_user_type: this.loginType // login by whome
    }

    this.sweetalertWarning(uid, id, updateVendorsData, 'singleProductData');
  }

  // warning alert box
  sweetalertWarning(_uid, _id, _updateVendorsData, _type) {
    swal({
      title: 'Are you sure?',
      text: 'Want to delete data!',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: "",
          closeModal: true
        },
        confirm: {
          text: 'Yes, delete it!',
          value: true,
          visible: true,
          className: "bg-danger",
          closeModal: false
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        if (_type == "singleProductData") {
          const disableUser = firebase.functions().httpsCallable('disableUser');
          disableUser(_uid).then((result) => {
            if (result) {
              this.vendorsService.softDeleteSingleProduct(_id, _updateVendorsData).then(() => {
                this.afs.collection("settings").doc('counts').update({
                  'counts.vendors': firebase.firestore.FieldValue.increment(-1)
                }).then(() => {
                  swal('Deleted!', 'Data deleted!', 'success');

                  // call function for update listing data
                  this.getVendorsListingData();
                });
              })
            }
          });

        } else if (_type == "multipleProductData") {
          const disableMultipleUser = firebase.functions().httpsCallable('disableMultipleUser');
          _updateVendorsData.forEach(item => {
            disableMultipleUser(item.uid).then((result) => {
              if (result) {
                this.vendorsService.softDeleteMultipleProduct(item).then(() => {
                  this.afs.collection("settings").doc('counts').update({
                    'counts.vendors': firebase.firestore.FieldValue.increment(-1)
                  }).then(() => {
                    swal('Deleted!', 'Data deleted!', 'success');

                    // call function for update listing data
                    this.getVendorsListingData();
                  });
                });
              }
            });
          });
        }
      }
    });
  }

}

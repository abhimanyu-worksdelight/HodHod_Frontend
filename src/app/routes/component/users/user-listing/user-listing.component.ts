import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from '../../../services/user/user.service';
import firebase from 'firebase/app';
import "firebase/functions";

const swal = require('sweetalert');
@Component({
  selector: 'app-users',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersListingComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Users: any = [];
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;
  arrayRowData: any = "";
  isLoading: boolean = false;
  loginType: string;
  uid: string

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    // get user data
    this.getUserListingData();
  }

  getUserListingData() {
    this.userService.getUserList().subscribe(res => {
      this.isLoading = true;
      this.Users = [];
      this.rowsFilter = [];
      this.arrayTableData = [];

      if (res.length) {
        this.Users = res.map(e => {

          let data = e.payload.doc.data()

          if (data['phone_number'] && data['country_code']) {
            data['phone_number'] = `(${data['country_code']}) ${data['phone_number']}`
          } else {
            data['phone_number'] = '--'
          }

          return {
            id: e.payload.doc.id,
            data
          }
        })
        // console.log('users', this.Users);

        // set data for datatable start---------------
        this.arrayTableData = [];
        for (let i = 0; i < this.Users.length; i++) {
          this.arrayRowData = this.Users[i].data;
          this.arrayRowData.sr_no = i + 1;
          this.arrayRowData.id = "USR:" + this.Users[i].id;
          this.arrayTableData.push(this.arrayRowData);
          this.isLoading = false;
        }
        // console.log("arrayTableData", this.arrayTableData);
        this.rowsFilter = this.arrayTableData;
        // set data for datatable end---------------
      } else {
        this.isLoading = false;
      }
    });
  }

  // search datatable data start--------------
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.arrayTableData.filter(function (d) {
      if (d.name != '' && d.name != null) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    // update the rows
    this.rowsFilter = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  // search datatable data end--------------

  ngAfterViewInit() {
  }

  deleteUserData(id, data) {
    const updateUserData = {
      deleted_at: firebase.firestore.FieldValue.serverTimestamp(), //date and time
      deleted_by: this.uid, // id
      disabled: false,
      deleted_by_user_type: this.loginType // login by whome
    }

    this.sweetalertWarning(data.uid, id, updateUserData, 'singleUserData');
  }

  // warning alert box
  sweetalertWarning(_uid, _id, _updateUserData, _type) {
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
        if (_type == "singleUserData") {
          const disableUser = firebase.functions().httpsCallable('disableUser');
          disableUser(_uid).then((result) => {
            if (result) {
              this.userService.softDeleteSingleUser(_id, _updateUserData).then(() => {
                swal('Deleted!', 'Data deleted!', 'success');

                // call function for update listing data
                this.getUserListingData();
              })
            }
          });

        } else if (_type == "multipleUserData") {
          const disableMultipleUser = firebase.functions().httpsCallable('disableMultipleUser');
          _updateUserData.forEach(item => {
            disableMultipleUser(item.uid).then((result) => {
              if (result) {
                this.userService.softDeleteMultipleUser(item).then(() => {
                  swal('Deleted!', 'Data deleted!', 'success');

                  // call function for update listing data
                  this.getUserListingData();
                });
              }
            });
          });
        }
      }
    });
  }

}
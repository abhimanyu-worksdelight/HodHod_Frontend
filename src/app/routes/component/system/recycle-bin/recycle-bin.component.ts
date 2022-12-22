import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { RecycleBinService } from '../../../services/system/recycle-bin/recycle-bin.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from "firebase/app";
import "firebase/functions";

const swal = require('sweetalert');
@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecycleBinComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  uid: any;
  statusColor: any;
  isLoading: boolean;
  loginType: string;

  deletedByUserAllIds: any = [];
  deletedByVendorAllIds: any = [];

  constructor(
    private recycleBinService: RecycleBinService,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    // login type
    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    // get status settings end-----------
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    // get data
    this.getAllData();
  }

  getAllData(){
    this.isLoading = true;
    this.arrayTableData = [];
    this.rowsFilter = [];

    // get appuser data
    this.getUserListing();

    // get vendor data
    this.getVendorListByIds();

    setTimeout(() => {
      // -----------------get deleted by user start---------------
      for(let i = 0; i<this.arrayTableData.length; i++){
        
        if((this.arrayTableData[i].deleted_by_user_type == "WxAsS1whStfbgdXvxqHs" || 
        this.arrayTableData[i].deleted_by_user_type == "u7GeGmO2luLmkOMKeZ0k") && 
        this.arrayTableData[i].type == "uMdXXnNmXBIk3HiJX9qs"){
          this.deletedByUserAllIds.push(this.arrayTableData[i].deleted_by);
          // console.log("deletedByUserAllIds", this.deletedByUserAllIds);

        }else if((this.arrayTableData[i].deleted_by_user_type == "WxAsS1whStfbgdXvxqHs" || 
        this.arrayTableData[i].deleted_by_user_type == "u7GeGmO2luLmkOMKeZ0k")){
          this.deletedByVendorAllIds.push(this.arrayTableData[i].deleted_by);
          // console.log("deletedByVendorAllIds", this.deletedByVendorAllIds);

        }
      }

      if(this.deletedByUserAllIds && this.deletedByUserAllIds.length){
        this.recycleBinService.getUserListByIds(this.deletedByUserAllIds).then((finalData: Array<any>) => {
          const finalList = finalData;
          const arrayTableDataLength = this.arrayTableData.length;
          
          for(let i=0; i<arrayTableDataLength; i++){
      
            let snitchData = this.arrayTableData[i];
            console.log("snitchData", snitchData);
            const snitchCreator = finalList.find(item => item['uid'] == snitchData.deleted_by);
            snitchData.deleted_by_username = snitchCreator ? (snitchCreator['name']) : 'N/A'
            const arrayRowData = snitchData;
            arrayRowData.sr_no = i+1;
            arrayRowData.deleted_by_username = snitchData.deleted_by_username;
            this.arrayTableData.push(arrayRowData);
            this.isLoading = false;
          }
        });

      }else{
        this.isLoading = false;
      }

      if(this.deletedByVendorAllIds && this.deletedByVendorAllIds.length){
        this.recycleBinService.getVendorListByIds(this.deletedByVendorAllIds).then((finalData: Array<any>) => {
          const finalList = finalData;
          
          const arrayTableDataLength = this.arrayTableData.length;
          
          for(let i=0; i<arrayTableDataLength; i++){
      
            let snitchData = this.arrayTableData[i];
            // console.log("snitchData", snitchData);
            const snitchCreator = finalList.find(item => item['uid'] == snitchData.deleted_by);
            snitchData.deleted_by_username = snitchCreator ? (snitchCreator['name']) : 'N/A'
            const arrayRowData = snitchData;
            arrayRowData.sr_no = i+1;
            arrayRowData.deleted_by_username = snitchData.deleted_by_username;
            this.arrayTableData.push(arrayRowData);
            this.isLoading = false;
          }
        });

      }else{
        this.isLoading = false;
      }

      this.rowsFilter = [...new Set(this.arrayTableData)];
      // console.log("this.rowsFilter", this.rowsFilter);
      this.isLoading = false;
    }, 5000);
    // get client data end----------
    
  }

  getUserListing = async() => {
    const userQry = this.afs.collection("users", ref => ref.where("deleted_at", "!=", null)).get().subscribe(userRes => {
      userQry.unsubscribe();

      if(userRes.size){
        let users = [];
        userRes.forEach(se => {
          let postData = {
            data: se.data(),
            id: se.id,
          }
          users.push(postData);
        });
        // console.log('users', users);
  
        if (users && users.length) {
          const arrayUserTableData = users.map(userItem => {
            let arrayUserRowData = userItem.data;
            arrayUserRowData['rowdata'] = arrayUserRowData['name'];
            arrayUserRowData['section'] = "User";
            arrayUserRowData['id'] = userItem.id;
            return arrayUserRowData;
          });
          this.arrayTableData = [...this.arrayTableData, ...new Set(arrayUserTableData)]; // push data
          // console.log("client arrayTableData", this.arrayTableData);
        }
      }
    });
  }

  getVendorListByIds = async() => {
    const vendorsQry = this.afs.collection("vendors", ref => ref.where("deleted_at", "!=", null)).get().subscribe(vendorRes => {
      vendorsQry.unsubscribe();

      if(vendorRes.size){
        let vendors = [];
        vendorRes.forEach(se => {
          let postData = {
            data: se.data(),
            id: se.id
          }
          vendors.push(postData);
        });
        // console.log('appUsers', vendors);
  
        if (vendors && vendors.length) {
          const arrayAppUserTableData = vendors.map(appUserItem => {
            let arrayAppUserRowData = appUserItem.data;
            arrayAppUserRowData['rowdata'] = arrayAppUserRowData['name'];
            arrayAppUserRowData['section'] = "Vendors";
            arrayAppUserRowData['id'] = appUserItem.id
            return arrayAppUserRowData;
          });
          this.arrayTableData = [...this.arrayTableData, ...new Set(arrayAppUserTableData)]; // push data
          // console.log("client arrayTableData", this.arrayTableData);
        }
      }
    });
  }

  // search datatable data start--------------
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.arrayTableData.filter(function(d) {
      if(d.name != '' && d.name != null){
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    // update the rows
    this.rowsFilter = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  // search datatable data end--------------
  
  restoreRecyclebinData(id, data){
    if(data.section == "User"){
      let postData = { 
        deleted_at: null, //date and time
        deleted_by: null, // id
        disabled: false,
        deleted_by_user_type: null // login by whome
      }
      this.sweetalertRestoreWarning(data.uid, id, data.section, postData);
      
    }else if(data.section == "Vendors"){
      let postData = { 
        deleted_at: null, //date and time
        deleted_by: null, // id
        disabled: false,
        deleted_by_user_type: null // login by whome
      }
      this.sweetalertRestoreWarning(data.uid, id, data.section, postData);
    }
  }

  sweetalertRestoreWarning(_uid, _id, _type, _data) {
    swal({
      title: 'Confirm Restore',
      text: 'Are you sure move this to Restore?',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: "",
          closeModal: false
        },
        confirm: {
          text: 'Yes',
          value: true,
          visible: true,
          className: "bg-danger",
          closeModal: false
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        if(_type == "User"){
          this.recycleBinService.restoreAppuser(_uid, _data).then(() => {
            const enableUser = firebase.functions().httpsCallable('enableUser');
            enableUser(_uid).then((result) => {
              if(result){
                swal('', 'Restore successfully!', 'success');
                // call function for update listing data
                this.getAllData();
              }
            });
          });

        }else if(_type == "Vendors"){
          this.recycleBinService.restoreVendor(_id, _data).then(() => {
            const enableUser = firebase.functions().httpsCallable('enableUser');
            enableUser(_uid).then((result) => {
              if(result){
                swal('', 'Restore successfully!', 'success');
                // call function for update listing data
                this.getAllData();
              }
            });
          });
        }

      } else {
        swal('Cancelled', 'Data is safe :)', 'error');
      }
    });
  }

  deleteRecyclebinData(id, data){
    if(data.section == "Appuser"){
      this.sweetalertWarning(data.user_id, true, true, data.section);
    }
  }

  sweetalertWarning(_uid, _parentid, _id, _type) {
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
          text: 'Yes',
          value: true,
          visible: true,
          className: "bg-danger",
          closeModal: false
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        if(_type == "Appuser"){
          // delete user from authentication firebase start
          this.recycleBinService.deleteAppuser(_uid).then(() => {
            const deleteUser = firebase.functions().httpsCallable('deleteUser');
            deleteUser(_uid).then((result) => {

              if(result){
                swal('Deleted!', 'Data deleted!', 'success');
                // call function for update listing data
                this.getAllData();
              }
              
            }).catch(error => {
              console.log("error", error);
            });
          });
          // delete user from authentication firebase end

        }
      }
    });
  }
}

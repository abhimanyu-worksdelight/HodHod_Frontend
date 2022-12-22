import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ShopsService } from '../../../services/shops/shops.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AngularFirestore } from '@angular/fire/firestore';

const swal = require('sweetalert');
@Component({
  selector: 'app-shops-list',
  templateUrl: './shops-list.component.html',
  styleUrls: ['./shops-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopsListComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Shops: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  loginType: string;
  arrayTableData: any = [];
  vendorNames: any = [];
  byVendorsAllIds: any = [];

  sr_no: number;
  uid: string;
  isLoading: boolean = false;

  constructor(
    private shopsService: ShopsService,
    private afs: AngularFirestore
  ) { }

  /**
   * 
   */
  ngOnInit(): void {
    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
      if (venRes.length) {
        this.rowsFilter = [];
        this.arrayRowData = [];
        this.arrayTableData = [];
        this.Shops = [];

        venRes.map(ve => {
          if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
            this.afs.collection("shops", ref => ref.where('vendor_id', "==", ve.payload.doc.id)).snapshotChanges().subscribe(res => {
              this.isLoading = true;
              this.rowsFilter = [];
              this.arrayRowData = [];
              this.arrayTableData = [];
              this.Shops = [];

              if (res.length) {
                this.Shops = res.map(e => {
                  let data = e.payload.doc.data()

                  return {
                    id: e.payload.doc.id,
                    data
                  }
                })

                for (let i = 0; i < this.Shops.length; i++) {
                  this.arrayRowData = this.Shops[i].data;
                  this.arrayRowData.sr_no = i + 1;
                  this.arrayRowData.id = this.Shops[i].id;
                  this.arrayTableData.push(this.arrayRowData);

                  this.isLoading = false;
                }

                for (let i = 0; i < this.arrayTableData.length; i++) {
                  if (this.arrayTableData[i].vendor_id) {
                    this.byVendorsAllIds.push(this.arrayTableData[i].vendor_id);
                  }
                }

                if (this.byVendorsAllIds && this.byVendorsAllIds.length) {
                  this.shopsService.getVendersListByIds(this.byVendorsAllIds).then((finalData: Array<any>) => {
                    const finalList = finalData;

                    const arrayTableDataLength = this.arrayTableData.length;

                    for (let i = 0; i < arrayTableDataLength; i++) {
                      let snitchData = this.arrayTableData[i];
                      const snitchCreator = finalList.find(item => item.id == snitchData.vendor_id);
                      const arrayRowData = snitchData;
                      arrayRowData.sr_no = i + 1;
                      arrayRowData.vender_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                      this.arrayTableData.push(arrayRowData);
                    }
                    this.rowsFilter = [...new Set(this.arrayTableData)];
                    // console.log("this.rowsFilter", this.rowsFilter);
                  });
                } else {
                  this.isLoading = false;
                }

                this.rowsFilter = [...new Set(this.arrayTableData)];

              } else {
                this.isLoading = false;
              }
            });

          }
        });

      } else {
        this.afs.collection("vendors", ref => ref.where('created_by', "==", this.uid)).snapshotChanges().subscribe(venRes => {
          this.shopsService.getShopsList().subscribe(res => {
            this.isLoading = true;
            if (res.length) {
              this.rowsFilter = [];
              this.arrayRowData = [];
              this.arrayTableData = [];
              this.Shops = [];

              this.Shops = res.map(e => {
                let data = e.payload.doc.data()

                return {
                  id: e.payload.doc.id,
                  data
                }
              })
              for (let i = 0; i < this.Shops.length; i++) {
                this.afs.collection("vendors", ref => ref.where("deleted_at", '==', null)).snapshotChanges().subscribe(res => {
                  res.map(e => {
                    const vendorId = e.payload.doc.id;
                    res.map(e => {
                      let data: Object = e.payload.doc.data();
                      this.vendorNames.push(data['name']);
                    });

                  });
                });
              }

              this.arrayRowData = [];
              this.arrayTableData = [];
              for (let i = 0; i < this.Shops.length; i++) {
                this.arrayRowData = this.Shops[i].data;
                this.arrayRowData.sr_no = i + 1;
                this.arrayRowData.id = "STR:" + this.Shops[i].id;
                this.arrayTableData.push(this.arrayRowData);
                this.isLoading = false;
              }

              for (let i = 0; i < this.arrayTableData.length; i++) {
                if (this.arrayTableData[i].vendor_id) {
                  this.byVendorsAllIds.push(this.arrayTableData[i].vendor_id);
                }
              }
              // console.log("byOrdersAllIds", this.byVendorsAllIds);


              if (this.byVendorsAllIds && this.byVendorsAllIds.length) {
                this.shopsService.getVendersListByIds(this.byVendorsAllIds).then((finalData: Array<any>) => {
                  const finalList = finalData;

                  const arrayTableDataLength = this.arrayTableData.length;

                  for (let i = 0; i < arrayTableDataLength; i++) {
                    let snitchData = this.arrayTableData[i];
                    const snitchCreator = finalList.find(item => item.id == snitchData.vendor_id);
                    const arrayRowData = snitchData;

                    // console.log('arrayRowData', arrayRowData);
                    // console.log('snitchCreator.data name', snitchCreator.data['name']);
                    arrayRowData.sr_no = i + 1;
                    arrayRowData.vender_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                    this.arrayTableData.push(arrayRowData);
                  }
                  this.arrayTableData = [...new Set(this.arrayTableData)];
                  this.rowsFilter = [...new Set(this.arrayTableData)];
                });
              } else {
                this.isLoading = false;
              }

              this.rowsFilter = [...new Set(this.arrayTableData)];

            } else {
              this.isLoading = false;
            }
          });
        });
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

  deleteShopData(id) {
    this.sweetalertWarning(id);
  }

  // warning alert box
  sweetalertWarning(_id) {
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
        this.shopsService.deleteShop(_id);
        swal('Deleted!', 'Data deletd!', 'success');
      }
    });
  }
}

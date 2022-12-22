import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdersService } from '../../../services/orders/orders.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

const swal = require('sweetalert');

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Products: any = [];
  Orders: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  byOrdersAllIds: any = [];
  byGiftSenderAllIds: any = [];
  sr_no: number;
  loginType: string;
  isLoading: boolean = false;
  uid: string;
  totalRevenue: number = 0;
  isVendor: boolean = false;
  positionItems: any = [0, 1, 2];
  allTabActive = 1;

  constructor(
    private ordersService: OrdersService,
    private afs: AngularFirestore
  ) { }

  /**
   * 
   */
  ngOnInit(): void {
    this.loginType = sessionStorage.getItem('loginType');
    console.log("this.loginType", this.loginType);

    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);
    this.getAllOrders()

  }

  getRedeemedOrders() {
    if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
      this.isVendor = false;
      // return this.afs.collection("mavTags", ref => ref.orderBy('timestamp','desc')).get();

      this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
        this.rowsFilter = [];
        this.arrayTableData = [];

        if (venRes.length) {
          venRes.map(ve => {
            // this.afs.collection("orders", ref => ref.where("store_id", "==", ve.payload.doc.id)).snapshotChanges().subscribe(res => {

            this.afs.collection("orders", ref => ref).snapshotChanges().subscribe(res => {
              this.isLoading = true;
              this.rowsFilter = [];
              this.arrayTableData = [];
              this.totalRevenue = 0;

              if (res.length) {
                this.Orders = [];
                this.Orders = res.map(e => {
                  let data = e.payload.doc.data();
                  // console.log("data", data);
                  return {
                    id: e.payload.doc.id,
                    data
                  }
                })

                // set data for datatable start---------------
                this.arrayTableData = [];
                for (let i = 0; i < this.Orders.length; i++) {
                  if (this.Orders[i].data != null && this.Orders[i].data.redeem_status != null &&
                    this.Orders[i].data.redeem_status.is_redeemed == true) {

                    this.arrayRowData = this.Orders[i].data;
                    this.arrayRowData.sr_no = i + 1;
                    this.arrayRowData.id = this.Orders[i].id;

                    this.arrayTableData.push(this.arrayRowData);
                    this.isLoading = false;
                  }

                }
                // set data for datatable end---------------

                if (this.arrayTableData) {

                  for (let i = 0; i < this.arrayTableData.length; i++) {
                    if (this.arrayTableData[i].product_id) {
                      this.byOrdersAllIds.push(this.arrayTableData[i].product_id);
                    }
                  }
                  console.log("byOrdersAllIds", this.byOrdersAllIds);


                  for (let i = 0; i < this.arrayTableData.length; i++) {
                    if (this.arrayTableData[i].gift_sender) {
                      this.byGiftSenderAllIds.push(this.arrayTableData[i].gift_sender);
                    }
                  }
                  console.log("byGiftSenderAllIds AllRedeemed", this.byGiftSenderAllIds);

                  if (this.byOrdersAllIds && this.byOrdersAllIds.length) {
                    this.ordersService.getItemListByIds(this.byOrdersAllIds).then((finalData: Array<any>) => {
                      const finalList = finalData;

                      const arrayTableDataLength = this.arrayTableData.length;

                      for (let i = 0; i < arrayTableDataLength; i++) {
                        let snitchData = this.arrayTableData[i];
                        const snitchCreator = finalList.find(item => item.id == snitchData.product_id);
                        const arrayRowData = snitchData;
                        arrayRowData.sr_no = i + 1;
                        arrayRowData.item_name = snitchCreator ? (snitchCreator.data['itemInfo']['name']) : 'N/A';
                        arrayRowData.price = snitchCreator ? (snitchCreator.data['itemInfo']['price']) : 'N/A';





                        // const snitchCreatorGiftSender = finalList.find(item => item.id == snitchData.gift_sender);

                        // const giftSender = finalList.filter(item => snitchData.gift_sender.includes(item.id));
                        // const arrayRowDatas = products;
                        // arrayRowData.product_id = products.map(s => s.data.name).join(', ');




                        let commission = 0;
                        let commissionType;
                        let commissionValue;
                        let amount = 0;

                        if (this.arrayTableData[i].commission) {
                          commissionType = this.arrayTableData[i].commission.type;

                          commissionValue = this.arrayTableData[i].commission.value;

                          if (commissionType == 'SAR') {
                            commission = commissionValue;

                          } else if (commissionType == '%') {
                            commission = (snitchCreator.data['itemInfo']['price'] * this.arrayTableData[i].commission.value) / 100// / this.arrayTableData[i].commission.value;
                            amount = snitchCreator.data['itemInfo']['price'] - commission;

                          } else {
                            amount = 0;
                          }
                        }
                        this.arrayRowData.commission = commissionValue + ' (' + commissionType + ')';
                        this.arrayRowData.amount = amount;
                        this.totalRevenue = this.totalRevenue + amount;
                        console.log("revenue" + this.totalRevenue);

                        this.arrayTableData.push(arrayRowData);
                      }
                      this.rowsFilter = this.arrayTableData;
                      this.rowsFilter = [...new Set(this.rowsFilter)];
                      // console.log("this.rowsFilter", this.rowsFilter);
                    });
                  } else {
                    this.isLoading = false;

                  }


                  if (this.byGiftSenderAllIds && this.byGiftSenderAllIds.length) {
                    this.ordersService.getUserListByIds(this.byGiftSenderAllIds).then((finalData: Array<any>) => {
                      const finalList = finalData;

                      const arrayTableDataLength = this.arrayTableData.length;

                      for (let i = 0; i < arrayTableDataLength; i++) {
                        let snitchData = this.arrayTableData[i];
                        const snitchCreator = finalList.find(item => item.id == snitchData.gift_sender);
                        const arrayRowData = snitchData;
                        arrayRowData.sr_no = i + 1;
                        arrayRowData.user_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                        this.arrayTableData.push(arrayRowData);
                      }
                      this.rowsFilter = this.arrayTableData;
                      this.rowsFilter = [...new Set(this.rowsFilter)];
                      // console.log("this.rowsFilter", this.rowsFilter);
                    });
                  } else {
                    this.isLoading = false;

                  }
                }

              } else {
                this.isLoading = false;
              }
            });
          });
        }
      });

    }
    else {
      if (this.loginType == 'WxAsS1whStfbgdXvxqHs') {
        this.isVendor = true;

      } else {
        this.isVendor = false;

      }

      this.ordersService.getOnlyRedeemedOrders().subscribe(res => {
        this.isLoading = true;
        this.rowsFilter = [];
        this.arrayTableData = [];
        this.totalRevenue = 0;

        if (res.length) {
          this.Orders = [];
          this.Orders = res.map(e => {
            let data = e.payload.doc.data();
            // console.log("data", data);
            return {
              id: e.payload.doc.id,
              data
            }
          })

          // set data for datatable start---------------
          this.arrayTableData = [];
          for (let i = 0; i < this.Orders.length; i++) {

            this.arrayRowData = this.Orders[i].data;

            this.arrayRowData.sr_no = i + 1;
            this.arrayRowData.id = "OR:" + this.Orders[i].id;
            this.arrayTableData.push(this.arrayRowData);
            this.isLoading = false;
          }
          // set data for datatable end---------------

          if (this.arrayTableData) {

            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].product_id) {
                this.byOrdersAllIds.push(this.arrayTableData[i].product_id);
              }
            }
            // console.log("byOrdersAllIds", this.byOrdersAllIds);

            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].gift_sender) {
                this.byGiftSenderAllIds.push(this.arrayTableData[i].gift_sender);
              }
            }

            if (this.byOrdersAllIds && this.byOrdersAllIds.length) {
              this.ordersService.getItemListByIds(this.byOrdersAllIds).then((finalData: Array<any>) => {
                const finalList = finalData;

                const arrayTableDataLength = this.arrayTableData.length;
                // console.log("arrayTableDataLength", arrayTableDataLength);

                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const snitchCreator = finalList.find(item => item.id == snitchData.product_id);
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.item_name = snitchCreator ? (snitchCreator.data['itemInfo']['name']) : 'N/A';
                  arrayRowData.price = snitchCreator ? (snitchCreator.data['itemInfo']['price']) : 'N/A';

                  let commission = 0;
                  let commissionType;
                  let commissionValue;
                  let amount = 0;

                  if (this.arrayTableData[i].commission) {
                    commissionType = this.arrayTableData[i].commission.type;
                    commissionValue = this.arrayTableData[i].commission.value;

                    if (commissionType == 'SAR') {
                      commission = commissionValue;

                    } else if (commissionType == '%') {
                      commission = (snitchCreator.data['itemInfo']['price'] * this.arrayTableData[i].commission.value) / 100// / this.arrayTableData[i].commission.value;
                      amount = commission;

                    } else {
                      amount = 0;
                    }
                  }
                  this.arrayRowData.commission = commissionValue + ' (' + commissionType + ')';
                  this.arrayRowData.amount = amount;

                  this.totalRevenue = this.totalRevenue + amount;

                  this.arrayTableData.push(arrayRowData);
                  console.log("revenue" + this.totalRevenue);
                }
                this.rowsFilter = this.arrayTableData;
                this.rowsFilter = [...new Set(this.rowsFilter)];
                // console.log("this.rowsFilter", this.rowsFilter);
              });
            }

            if (this.byGiftSenderAllIds && this.byGiftSenderAllIds.length) {
              this.ordersService.getUserListByIds(this.byGiftSenderAllIds).then((finalData: Array<any>) => {
                const finalList = finalData;

                const arrayTableDataLength = this.arrayTableData.length;

                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const snitchCreator = finalList.find(item => item.id == snitchData.gift_sender);
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.user_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                  this.arrayTableData.push(arrayRowData);
                }
                this.rowsFilter = this.arrayTableData;
                this.rowsFilter = [...new Set(this.rowsFilter)];
                // console.log("this.rowsFilter", this.rowsFilter);
              });
            } else {
              this.isLoading = false;
            }

          }

        } else {
          this.isLoading = false;
        }
      });
    }

  }
  getAllOrders() {
    if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
      this.isVendor = false;
      // return this.afs.collection("mavTags", ref => ref.orderBy('timestamp','desc')).get();

      this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
        this.rowsFilter = [];
        this.arrayTableData = [];

        if (venRes.length) {
          venRes.map(ve => {
            // this.afs.collection("orders", ref => ref.where("store_id", "==", ve.payload.doc.id)).snapshotChanges().subscribe(res => {

            this.afs.collection("orders", ref => ref).snapshotChanges().subscribe(res => {
              this.isLoading = true;
              this.rowsFilter = [];
              this.arrayTableData = [];
              this.totalRevenue = 0;

              if (res.length) {
                this.Orders = [];
                this.Orders = res.map(e => {
                  let data = e.payload.doc.data();
                  // console.log("data", data);
                  return {
                    id: e.payload.doc.id,
                    data
                  }
                })

                // set data for datatable start---------------
                this.arrayTableData = [];
                for (let i = 0; i < this.Orders.length; i++) {
                  if (this.Orders[i].data != null && this.Orders[i].data.redeem_status != null &&
                    this.Orders[i].data.redeem_status.is_redeemed == true) {

                    this.arrayRowData = this.Orders[i].data;
                    this.arrayRowData.sr_no = i + 1;
                    this.arrayRowData.id = this.Orders[i].id;

                    this.arrayTableData.push(this.arrayRowData);
                    this.isLoading = false;
                  }

                }
                // set data for datatable end---------------

                if (this.arrayTableData) {

                  for (let i = 0; i < this.arrayTableData.length; i++) {
                    if (this.arrayTableData[i].product_id) {
                      this.byOrdersAllIds.push(this.arrayTableData[i].product_id);
                    }
                  }
                  console.log("byOrdersAllIds", this.byOrdersAllIds);


                  for (let i = 0; i < this.arrayTableData.length; i++) {
                    if (this.arrayTableData[i].gift_sender) {
                      this.byGiftSenderAllIds.push(this.arrayTableData[i].gift_sender);
                    }
                  }
                  console.log("byGiftSenderAllIds AllOrders", this.byGiftSenderAllIds);

                  if (this.byOrdersAllIds && this.byOrdersAllIds.length) {
                    this.ordersService.getItemListByIds(this.byOrdersAllIds).then((finalData: Array<any>) => {
                      const finalList = finalData;

                      const arrayTableDataLength = this.arrayTableData.length;

                      for (let i = 0; i < arrayTableDataLength; i++) {
                        let snitchData = this.arrayTableData[i];
                        const snitchCreator = finalList.find(item => item.id == snitchData.product_id);
                        const arrayRowData = snitchData;
                        arrayRowData.sr_no = i + 1;
                        arrayRowData.item_name = snitchCreator ? (snitchCreator.data['itemInfo']['name']) : 'N/A';
                        arrayRowData.price = snitchCreator ? (snitchCreator.data['itemInfo']['price']) : 'N/A';





                        // const snitchCreatorGiftSender = finalList.find(item => item.id == snitchData.gift_sender);

                        // const giftSender = finalList.filter(item => snitchData.gift_sender.includes(item.id));
                        // const arrayRowDatas = products;
                        // arrayRowData.product_id = products.map(s => s.data.name).join(', ');




                        let commission = 0;
                        let commissionType;
                        let commissionValue;
                        let amount = 0;

                        if (this.arrayTableData[i].commission) {
                          commissionType = this.arrayTableData[i].commission.type;

                          commissionValue = this.arrayTableData[i].commission.value;

                          if (commissionType == 'SAR') {
                            commission = commissionValue;

                          } else if (commissionType == '%') {
                            commission = (snitchCreator.data['itemInfo']['price'] * this.arrayTableData[i].commission.value) / 100// / this.arrayTableData[i].commission.value;
                            amount = snitchCreator.data['itemInfo']['price'] - commission;

                          } else {
                            amount = 0;
                          }
                        }
                        this.arrayRowData.commission = commissionValue + ' (' + commissionType + ')';
                        this.arrayRowData.amount = amount;
                        this.totalRevenue = this.totalRevenue + amount;
                        console.log("revenue" + this.totalRevenue);

                        this.arrayTableData.push(arrayRowData);
                      }
                      this.rowsFilter = this.arrayTableData;
                      this.rowsFilter = [...new Set(this.rowsFilter)];
                      // console.log("this.rowsFilter", this.rowsFilter);
                    });
                  } else {
                    this.isLoading = false;

                  }


                  if (this.byGiftSenderAllIds && this.byGiftSenderAllIds.length) {
                    this.ordersService.getUserListByIds(this.byGiftSenderAllIds).then((finalData: Array<any>) => {
                      const finalList = finalData;

                      const arrayTableDataLength = this.arrayTableData.length;

                      for (let i = 0; i < arrayTableDataLength; i++) {
                        let snitchData = this.arrayTableData[i];
                        const snitchCreator = finalList.find(item => item.id == snitchData.gift_sender);
                        const arrayRowData = snitchData;
                        arrayRowData.sr_no = i + 1;
                        arrayRowData.user_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                        this.arrayTableData.push(arrayRowData);
                      }
                      this.rowsFilter = this.arrayTableData;
                      this.rowsFilter = [...new Set(this.rowsFilter)];
                      // console.log("this.rowsFilter", this.rowsFilter);
                    });
                  } else {
                    this.isLoading = false;

                  }
                }

              } else {
                this.isLoading = false;
              }
            });
          });
        }
      });

    }
    else {
      if (this.loginType == 'WxAsS1whStfbgdXvxqHs') {
        this.isVendor = true;

      } else {
        this.isVendor = false;

      }

      this.ordersService.getOrdersListSuperAdmin().subscribe(res => {
        this.isLoading = true;
        this.rowsFilter = [];
        this.arrayTableData = [];
        this.totalRevenue = 0;

        if (res.length) {
          this.Orders = [];
          this.Orders = res.map(e => {
            let data = e.payload.doc.data();
            // console.log("data", data);
            return {
              id: e.payload.doc.id,
              data
            }
          })

          // set data for datatable start---------------
          this.arrayTableData = [];
          console.log("this.arrayRowData.sr_no.." + this.arrayRowData.sr_no);
          for (let i = 0; i < this.Orders.length; i++) {

            this.arrayRowData = this.Orders[i].data;
            this.arrayRowData.sr_no = i + 1;
            this.arrayRowData.id = "OR:" + this.Orders[i].id;
            this.arrayTableData.push(this.arrayRowData);
            this.isLoading = false;
          }
          // set data for datatable end---------------

          if (this.arrayTableData) {

            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].product_id) {
                this.byOrdersAllIds.push(this.arrayTableData[i].product_id);
              }
            }
            // console.log("byOrdersAllIds", this.byOrdersAllIds);

            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].gift_sender) {
                this.byGiftSenderAllIds.push(this.arrayTableData[i].gift_sender);
              }
            }

            if (this.byOrdersAllIds && this.byOrdersAllIds.length) {
              this.ordersService.getItemListByIds(this.byOrdersAllIds).then((finalData: Array<any>) => {
                const finalList = finalData;

                const arrayTableDataLength = this.arrayTableData.length;
                // console.log("arrayTableDataLength", arrayTableDataLength);

                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const snitchCreator = finalList.find(item => item.id == snitchData.product_id);
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.item_name = snitchCreator ? (snitchCreator.data['itemInfo']['name']) : 'N/A';
                  arrayRowData.price = snitchCreator ? (snitchCreator.data['itemInfo']['price']) : 'N/A';

                  let commission = 0;
                  let commissionType;
                  let commissionValue;
                  let amount = 0;

                  if (this.arrayTableData[i].commission) {
                    commissionType = this.arrayTableData[i].commission.type;
                    commissionValue = this.arrayTableData[i].commission.value;

                    if (commissionType == 'SAR') {
                      commission = commissionValue;

                    } else if (commissionType == '%') {
                      commission = (snitchCreator.data['itemInfo']['price'] * this.arrayTableData[i].commission.value) / 100// / this.arrayTableData[i].commission.value;
                      amount = commission;

                    } else {
                      amount = 0;
                    }
                  }
                  this.arrayRowData.commission = commissionValue + ' (' + commissionType + ')';
                  this.arrayRowData.amount = amount;

                  this.totalRevenue = this.totalRevenue + amount;

                  this.arrayTableData.push(arrayRowData);
                  console.log("revenue" + this.totalRevenue);
                }
                this.rowsFilter = this.arrayTableData;
                this.rowsFilter = [...new Set(this.rowsFilter)];
                // console.log("this.rowsFilter", this.rowsFilter);
              });
            }

            if (this.byGiftSenderAllIds && this.byGiftSenderAllIds.length) {
              this.ordersService.getUserListByIds(this.byGiftSenderAllIds).then((finalData: Array<any>) => {
                const finalList = finalData;

                const arrayTableDataLength = this.arrayTableData.length;

                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const snitchCreator = finalList.find(item => item.id == snitchData.gift_sender);
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.user_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                  this.arrayTableData.push(arrayRowData);
                }
                this.rowsFilter = this.arrayTableData;
                this.rowsFilter = [...new Set(this.rowsFilter)];
                // console.log("this.rowsFilter", this.rowsFilter);
              });
            } else {
              this.isLoading = false;
            }

          }

        } else {
          this.isLoading = false;
        }
      });
    }

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
  // dropBool: boolean = false;

  onChange(dropValue, qrcode) {
    this.afs.collection('orders')
      .doc(qrcode['qr_code'])
      .update({ 'redeem_status.is_redeemed': dropValue == 'true' ? true : false })
      .then(() => {

        console.log('done');
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }

  onChangeAllTab(dropValue, qrcode) {
    this.sweetalertWarning(dropValue, qrcode)
  }
  onChangeRedeemedTab(dropValue, qrcode) {
    this.sweetalertWarning(dropValue, qrcode)

  }
  onChangePendingTab(dropValue, qrcode) {
    this.sweetalertWarning(dropValue, qrcode)

  }

  changeRedeemedStatusInFB(dropValue, qrcode) {
    this.afs.collection('orders')
      .doc(qrcode['qr_code'])
      .update({ 'redeem_status.is_redeemed': dropValue == 'true' ? true : false })
      .then(() => {

        console.log('done');
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }
  allTabClicked() {
    this.getAllOrders()
  }
  redeemTabClicked() {
    this.getRedeemedOrders()
    // console.log(this.rowsFilter.length)
    // for (let i = 0; i < this.rowsFilter.length; i++) {
    //   var isRedeemedPresent = (this.rowsFilter[i].redeem_status === undefined);
    //   var isRedeemedStatusPresent = (this.rowsFilter[i].redeem_status === undefined);

    //   if (isRedeemedPresent == true && isRedeemedStatusPresent == true) {
    //     console.log([i])
    //   }
    // }
  }
  pendingTabClicked() {
    this.getNotRedeemedOrders();
  }
  getNotRedeemedOrders() {
    if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
      console.log("u7GeGmO2luLmkOMKeZ0k..");
      this.isVendor = false;
      // return this.afs.collection("mavTags", ref => ref.orderBy('timestamp','desc')).get();

      this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
        this.rowsFilter = [];
        this.arrayTableData = [];

        if (venRes.length) {
          venRes.map(ve => {
            // this.afs.collection("orders", ref => ref.where("store_id", "==", ve.payload.doc.id)).snapshotChanges().subscribe(res => {

            this.afs.collection("orders", ref => ref).snapshotChanges().subscribe(res => {
              this.isLoading = true;
              this.rowsFilter = [];
              this.arrayTableData = [];
              this.totalRevenue = 0;

              if (res.length) {
                this.Orders = [];
                this.Orders = res.map(e => {
                  let data = e.payload.doc.data();
                  // console.log("data", data);
                  return {
                    id: e.payload.doc.id,
                    data
                  }
                })

                // set data for datatable start---------------
                this.arrayTableData = [];
                for (let i = 0; i < this.Orders.length; i++) {
                  if (this.Orders[i].data != null && this.Orders[i].data.redeem_status != null &&
                    this.Orders[i].data.redeem_status.is_redeemed == true) {

                    this.arrayRowData = this.Orders[i].data;
                    this.arrayRowData.sr_no = i + 1;
                    this.arrayRowData.id = this.Orders[i].id;

                    this.arrayTableData.push(this.arrayRowData);
                    this.isLoading = false;
                  }

                }
                // set data for datatable end---------------

                if (this.arrayTableData) {

                  for (let i = 0; i < this.arrayTableData.length; i++) {
                    if (this.arrayTableData[i].product_id) {
                      this.byOrdersAllIds.push(this.arrayTableData[i].product_id);
                    }
                  }
                  console.log("byOrdersAllIds", this.byOrdersAllIds);


                  for (let i = 0; i < this.arrayTableData.length; i++) {
                    if (this.arrayTableData[i].gift_sender) {
                      this.byGiftSenderAllIds.push(this.arrayTableData[i].gift_sender);
                    }
                  }
                  console.log("byGiftSenderAllIds NotRedeemed", this.byGiftSenderAllIds);

                  if (this.byOrdersAllIds && this.byOrdersAllIds.length) {
                    this.ordersService.getItemListByIds(this.byOrdersAllIds).then((finalData: Array<any>) => {
                      const finalList = finalData;

                      const arrayTableDataLength = this.arrayTableData.length;

                      for (let i = 0; i < arrayTableDataLength; i++) {
                        let snitchData = this.arrayTableData[i];
                        const snitchCreator = finalList.find(item => item.id == snitchData.product_id);
                        const arrayRowData = snitchData;
                        arrayRowData.sr_no = i + 1;
                        arrayRowData.item_name = snitchCreator ? (snitchCreator.data['itemInfo']['name']) : 'N/A';
                        arrayRowData.price = snitchCreator ? (snitchCreator.data['itemInfo']['price']) : 'N/A';





                        // const snitchCreatorGiftSender = finalList.find(item => item.id == snitchData.gift_sender);

                        // const giftSender = finalList.filter(item => snitchData.gift_sender.includes(item.id));
                        // const arrayRowDatas = products;
                        // arrayRowData.product_id = products.map(s => s.data.name).join(', ');




                        let commission = 0;
                        let commissionType;
                        let commissionValue;
                        let amount = 0;

                        if (this.arrayTableData[i].commission) {
                          commissionType = this.arrayTableData[i].commission.type;

                          commissionValue = this.arrayTableData[i].commission.value;

                          if (commissionType == 'SAR') {
                            commission = commissionValue;

                          } else if (commissionType == '%') {
                            commission = (snitchCreator.data['itemInfo']['price'] * this.arrayTableData[i].commission.value) / 100// / this.arrayTableData[i].commission.value;
                            amount = snitchCreator.data['itemInfo']['price'] - commission;

                          } else {
                            amount = 0;
                          }
                        }
                        this.arrayRowData.commission = commissionValue + ' (' + commissionType + ')';
                        this.arrayRowData.amount = amount;
                        this.totalRevenue = this.totalRevenue + amount;
                        console.log("revenue" + this.totalRevenue);

                        this.arrayTableData.push(arrayRowData);
                      }
                      this.rowsFilter = this.arrayTableData;
                      this.rowsFilter = [...new Set(this.rowsFilter)];
                      // console.log("this.rowsFilter", this.rowsFilter);
                    });
                  } else {
                    this.isLoading = false;

                  }


                  if (this.byGiftSenderAllIds && this.byGiftSenderAllIds.length) {
                    this.ordersService.getUserListByIds(this.byGiftSenderAllIds).then((finalData: Array<any>) => {
                      const finalList = finalData;

                      const arrayTableDataLength = this.arrayTableData.length;

                      for (let i = 0; i < arrayTableDataLength; i++) {
                        let snitchData = this.arrayTableData[i];
                        const snitchCreator = finalList.find(item => item.id == snitchData.gift_sender);
                        const arrayRowData = snitchData;
                        arrayRowData.sr_no = i + 1;
                        arrayRowData.user_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                        this.arrayTableData.push(arrayRowData);
                      }
                      this.rowsFilter = this.arrayTableData;
                      this.rowsFilter = [...new Set(this.rowsFilter)];
                      // console.log("this.rowsFilter", this.rowsFilter);
                    });
                  } else {
                    this.isLoading = false;

                  }
                }

              } else {
                this.isLoading = false;
              }
            });
          });
        }
      });

    }
    else {

      if (this.loginType == 'WxAsS1whStfbgdXvxqHs') {
        this.isVendor = true;
        console.log("WxAsS1whStfbgdXvxqHs")
      } else {
        this.isVendor = false;

      }

      this.ordersService.getPendingOrders().subscribe(res => {
        this.isLoading = true;
        this.rowsFilter = [];
        this.arrayTableData = [];
        this.totalRevenue = 0;

        if (res.length) {
          this.Orders = [];
          this.Orders = res.map(e => {
            let data = e.payload.doc.data();
            // console.log("data", data);
            return {
              id: e.payload.doc.id,
              data
            }
          })

          // set data for datatable start---------------
          this.arrayTableData = [];
          for (let i = 0; i < this.Orders.length; i++) {

            this.arrayRowData = this.Orders[i].data;
            this.arrayRowData.sr_no = i + 1;
            this.arrayRowData.id = "OR:" + this.Orders[i].id;
            this.arrayTableData.push(this.arrayRowData);
            this.isLoading = false;
          }
          // set data for datatable end---------------

          if (this.arrayTableData) {

            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].product_id) {
                this.byOrdersAllIds.push(this.arrayTableData[i].product_id);
              }
            }
            // console.log("byOrdersAllIds", this.byOrdersAllIds);

            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].gift_sender) {
                this.byGiftSenderAllIds.push(this.arrayTableData[i].gift_sender);
              }
            }

            if (this.byOrdersAllIds && this.byOrdersAllIds.length) {
              this.ordersService.getItemListByIds(this.byOrdersAllIds).then((finalData: Array<any>) => {
                const finalList = finalData;

                const arrayTableDataLength = this.arrayTableData.length;
                // console.log("arrayTableDataLength", arrayTableDataLength);

                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const snitchCreator = finalList.find(item => item.id == snitchData.product_id);
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.item_name = snitchCreator ? (snitchCreator.data['itemInfo']['name']) : 'N/A';
                  arrayRowData.price = snitchCreator ? (snitchCreator.data['itemInfo']['price']) : 'N/A';

                  let commission = 0;
                  let commissionType;
                  let commissionValue;
                  let amount = 0;

                  if (this.arrayTableData[i].commission) {
                    commissionType = this.arrayTableData[i].commission.type;
                    commissionValue = this.arrayTableData[i].commission.value;

                    if (commissionType == 'SAR') {
                      commission = commissionValue;

                    } else if (commissionType == '%') {
                      commission = (snitchCreator.data['itemInfo']['price'] * this.arrayTableData[i].commission.value) / 100// / this.arrayTableData[i].commission.value;
                      amount = commission;

                    } else {
                      amount = 0;
                    }
                  }
                  this.arrayRowData.commission = commissionValue + ' (' + commissionType + ')';
                  this.arrayRowData.amount = amount;

                  this.totalRevenue = this.totalRevenue + amount;

                  this.arrayTableData.push(arrayRowData);
                  console.log("revenue" + this.totalRevenue);
                }
                this.rowsFilter = this.arrayTableData;
                this.rowsFilter = [...new Set(this.rowsFilter)];
                // console.log("this.rowsFilter", this.rowsFilter);
              });
            }

            if (this.byGiftSenderAllIds && this.byGiftSenderAllIds.length) {
              this.ordersService.getUserListByIds(this.byGiftSenderAllIds).then((finalData: Array<any>) => {
                const finalList = finalData;

                const arrayTableDataLength = this.arrayTableData.length;

                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const snitchCreator = finalList.find(item => item.id == snitchData.gift_sender);
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.user_name = snitchCreator ? (snitchCreator.data['name']) : 'N/A';
                  this.arrayTableData.push(arrayRowData);
                }
                this.rowsFilter = this.arrayTableData;
                this.rowsFilter = [...new Set(this.rowsFilter)];
                // console.log("this.rowsFilter", this.rowsFilter);
              });
            } else {
              this.isLoading = false;
            }

          }

        } else {
          this.isLoading = false;
        }
      });
    }
  }


  // warning alert box
  sweetalertWarning(dropValue, qrcode) {
    swal({
      title: 'Are you sure?',
      text: 'you want to change status?',
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
          text: 'Yes!',
          value: true,
          visible: true,
          className: "bg-danger",
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.changeRedeemedStatusInFB(dropValue, qrcode)
      } else {

      }
    });
  }

}

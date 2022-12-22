import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ProductsService } from '../../../services/prodcts/products.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import "firebase/functions";
import { Papa } from 'ngx-papaparse';
import { ValidationService } from '../../../services/validation/validation.service';

const swal = require('sweetalert');
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsListComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  @ViewChild('csvReader') csvReader: any;
  public records: any[] = [];

  Products: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  arrayRowTableData: any = [];
  sr_no: number;
  loginType: string;
  isLoading: boolean = false;
  uid: string;
  allStoreIds: any = [];
  vendor_id: string;
  csvArr: any = [];

  constructor(
    private productsService: ProductsService,
    private afs: AngularFirestore,
    private papa: Papa,
    private validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.afs.collection('vendors', ref => ref.where('uid', '==', this.uid)).get().subscribe((res) => {
      res.forEach((e => {
        this.vendor_id = e.id;
      }));
    });

    // get product list
    this.getProductsList();
  }

  getProductsList() {
    this.Products = [];
    this.rowsFilter = [];
    this.arrayRowData = [];
    this.arrayTableData = [];

    if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
      this.Products = [];
      this.rowsFilter = [];
      this.arrayRowData = [];
      this.arrayTableData = [];

      this.afs.collection("vendors", ref => ref.where('uid', "==", this.uid)).snapshotChanges().subscribe(venRes => {
        if (venRes.length) {
          venRes.map(ve => {
            // console.log("venRes", ve.payload.doc.id);

            this.afs.collection("shops", ref => ref.where('vendor_id', "==", ve.payload.doc.id)).snapshotChanges().subscribe(storeRes => {
              if (storeRes.length) {
                storeRes.map(se => {

                  this.afs.collection('products', ref => ref.where('store_id', "array-contains", se.payload.doc.id)).snapshotChanges().subscribe(res => {

                    this.isLoading = true;
                    this.Products = [];
                    this.rowsFilter = [];
                    this.arrayRowData = [];
                    this.arrayTableData = [];

                    if (res.length) {
                      this.Products = res.map(e => {
                        let data = e.payload.doc.data();
                        return {
                          id: e.payload.doc.id,
                          data
                        }
                      });
                      // console.log("this.Products", this.Products);

                      // set data for datatable start---------------
                      this.arrayTableData = [];
                      for (let i = 0; i < this.Products.length; i++) {
                        this.arrayRowData = this.Products[i].data;
                        this.arrayRowData.sr_no = i + 1;
                        this.arrayRowData.id = this.Products[i].id;
                        this.arrayTableData.push(this.arrayRowData);
                        this.isLoading = false;
                      }
                      // set data for datatable end---------------

                      if (this.arrayTableData) {
                        for (let i = 0; i < this.arrayTableData.length; i++) {
                          if (this.arrayTableData[i].store_id) {
                            this.allStoreIds = [...new Set(this.arrayTableData[i].store_id)];
                          }
                        }
                        // console.log("this.allStoreIds", this.allStoreIds);   

                        if (this.allStoreIds && this.allStoreIds.length) {
                          this.rowsFilter = [];
                          this.productsService.getShopsByIds(this.allStoreIds.flat()).then((finalData: Array<any>) => {
                            const finalList = finalData;
                            const arrayTableDataLength = this.arrayTableData.length;
                            this.arrayRowTableData = [];
                            for (let i = 0; i < arrayTableDataLength; i++) {
                              let snitchData = this.arrayTableData[i];

                              const stores = finalList.filter(item => snitchData.store_id.includes(item.id));
                              const arrayRowData = snitchData;
                              arrayRowData.sr_no = i + 1;
                              arrayRowData.store_id = stores.map(s => s.data.name).join(', ');

                              // const snitchCreator = finalList.find(item => item.id == snitchData.store_id[i]);
                              // const arrayRowData = snitchData;
                              // arrayRowData.sr_no = i+1;
                              // arrayRowData.store_id = (snitchCreator.data['name'])?(snitchCreator.data['name']): 'N/A';

                              this.arrayRowTableData.push(arrayRowData);
                            }
                            this.rowsFilter = this.arrayRowTableData;
                            // console.log('this.rowsFilter', this.rowsFilter);
                          });
                        }
                      }

                    } else {
                      this.isLoading = false;
                    }
                  });

                });
              }
            });
          });
        }
      });

    } else {
      this.productsService.getProductsList().subscribe(res => {
        this.isLoading = true;
        this.Products = [];
        this.rowsFilter = [];
        this.arrayRowData = [];
        this.arrayTableData = [];

        if (res.length) {
          this.Products = [];

          this.Products = res.map(e => {
            let data = e.payload.doc.data()
            return {
              id: e.payload.doc.id,
              data
            }
          });
          // console.log("this.Products", this.Products);

          // set data for datatable start---------------
          this.arrayTableData = [];
          for (let i = 0; i < this.Products.length; i++) {
            this.arrayRowData = this.Products[i].data;
            this.arrayRowData.sr_no = i + 1;
            this.arrayRowData.id = "PR:" + this.Products[i].id;
            this.arrayTableData.push(this.arrayRowData);
            this.isLoading = false;
          }
          // set data for datatable end---------------

          if (this.arrayTableData) {
            for (let i = 0; i < this.arrayTableData.length; i++) {
              if (this.arrayTableData[i].store_id) {
                this.allStoreIds.push(this.arrayTableData[i].store_id);
              }
            }
            // console.log("this.allStoreIds", this.allStoreIds);   

            if (this.allStoreIds && this.allStoreIds.length) {
              this.rowsFilter = [];
              this.productsService.getShopsByIds(this.allStoreIds.flat()).then((finalData: Array<any>) => {
                const finalList = finalData;
                const arrayTableDataLength = this.arrayTableData.length;
                this.arrayRowTableData = [];
                for (let i = 0; i < arrayTableDataLength; i++) {
                  let snitchData = this.arrayTableData[i];
                  const stores = finalList.filter(item => snitchData.store_id.includes(item.id));
                  const arrayRowData = snitchData;
                  arrayRowData.sr_no = i + 1;
                  arrayRowData.store_id = stores.map(s => s.data.name).join(', ');
                  this.arrayRowTableData.push(arrayRowData);
                }
                this.rowsFilter = this.arrayRowTableData;
                // console.log('this.rowsFilter', this.rowsFilter);
              });
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
      if (d.store_id != '' && d.store_id != null) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    // update the rows
    this.rowsFilter = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  // search datatable data end--------------

  // upload csv file data start here ------
  handleFileSelect($event) {
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = (reader.result).toString();
        // console.log('csvData', csvData);

        let options = {
          complete: (results, file) => {
            console.log('Parsed: results', results['data']);
            this.saveProductToDB(results['data']);
          }
        };
        this.papa.parse(csvData, options);

        // let csvRecordsArray = (<any>csvData).split(/\r\n|\n/);  
        // console.log("csvRecordsArray", csvRecordsArray);

        // let headersRow = this.getHeaderArray(csvRecordsArray);  
        // this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  // getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {   
  //   for (let i = 1; i < csvRecordsArray.length; i++) {  
  //     let curruntRecord = (<string>csvRecordsArray[i]).split(','); 

  //     if (curruntRecord.length == headerLength) { 
  //       // console.log("curruntRecord", curruntRecord);
  //       this.csvArr.push(curruntRecord);
  //     }
  //   }  
  //   console.log('this.csvArr', this.csvArr.flat());

  //   return this.csvArr;  
  // } 

  // getHeaderArray(csvRecordsArr: any) {  
  //   let headers = (<string>csvRecordsArr[0]).split(',');  
  //   let headerArray = [];  
  //   for (let j = 0; j < headers.length; j++) {  
  //     headerArray.push(headers[j]);  
  //   }  
  //   return headerArray;  
  // }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }
  // upload csv file data end here ------

  deleteProductData(id, data) {
    this.sweetalertWarning(id, data);
  }

  saveProductToDB(data) {

    data.forEach((item, index) => {
      if (index == 0) { return 1; }

      let postData = {
        name: item[0],
        name_arabic: item[1],
        cat_id: item[2],
        inSection_id: item[3] || [],
        store_id: item[4],
        price: parseInt(item[5]),
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        created_by: this.uid,
        is_enabled: item[9],
        description: item[10],
        description_arabic: item[11],
        image: item[12] || '',
        previewImage: item[13] || '',
        deleted_at: null,
        deleted_by: null,
        disabled: false,
        deleted_by_user_type: null
      };
      // console.log('postData', postData);

      if (postData) {
        this.productsService.addProdct(postData).then(() => {

          this.afs.collection("settings").doc('counts').update({
            'counts.products': firebase.firestore.FieldValue.increment(1)
          }).then((res) => {
            console.log('Product count updated!', res);
          })
            .catch((error) => {
              console.log('error', error);
            });

          if ((data.length - 1) == index) {
            this.validationService.sweetalertSuccess();
          }

        }).catch((err) => {
          console.log(err);
        });
      }
    });
  }

  // warning alert box
  sweetalertWarning(_id, _data) {
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
        this.productsService.deleteProduct(_id).then(() => {

          if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
            var categoriesData = {};
            categoriesData[`categories.${_data.cat_id}`] = firebase.firestore.FieldValue.increment(-1);

            this.afs.collection("vendors").doc(this.vendor_id).update(categoriesData).then(() => {
              this.afs.collection("settings").doc('counts').update({
                'counts.products': firebase.firestore.FieldValue.increment(-1)
              }).then(() => {
                // get product list
                this.getProductsList();

                swal('Deleted!', 'Data deletd!', 'success');
              });
            });

          } else {
            this.afs.collection("settings").doc('counts').update({
              'counts.products': firebase.firestore.FieldValue.increment(-1)
            }).then(() => {
              // get product list
              this.getProductsList();

              swal('Deleted!', 'Data deletd!', 'success');
            });
          }
        });
      }
    });
  }
}

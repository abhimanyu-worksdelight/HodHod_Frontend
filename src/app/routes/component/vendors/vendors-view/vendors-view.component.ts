import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { VendorsService } from 'src/app/routes/services/vendors/vendors.service';

@Component({
  selector: 'app-vendors-view',
  templateUrl: './vendors-view.component.html',
  styleUrls: ['./vendors-view.component.scss']
})
export class VendorsViewComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  storesTabActive = 1
  vendorId: String = '';
  storesList: any = []
  productList: any = [];
  eachRowData = [];
  arrayTableData: any = [];
  arrayRowData: any = "";
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorsService,

  ) { }

  ngOnInit(): void {
    this.vendorId = this.route.snapshot.params['id'];
    this.getVendorStores();

  }
  getVendorStores() {
    console.log("id..." + this.vendorId)
    this.vendorService.getVendorStores(this.vendorId).subscribe(res => {
      this.storesList = [];
      this.storesList = res.map(e => {
        let data = e.payload.doc.data();
        return {
          id: e.payload.doc.id,
          data
        }
      })
      console.log("storesList..." + this.storesList)
      this.arrayTableData = [];
      for (let i = 0; i < this.storesList.length; i++) {
        this.arrayRowData = this.storesList[i].data;
        this.arrayRowData.sr_no = i + 1;
        this.arrayRowData.id = this.storesList[i].id;
        this.arrayTableData.push(this.arrayRowData);
      }
      this.eachRowData = this.arrayTableData;
      console.log(
        "storesLength.." + this.storesList.length
      );
    });
  }


  getVendorProducts() {
    this.vendorService.getVendorProducts(this.vendorId).subscribe(res => {
      this.productList = [];
      this.productList = res.map(e => {
        let data = e.payload.doc.data();
        return {
          id: e.payload.doc.id,
          data
        }
      })
      this.arrayTableData = [];
      for (let i = 0; i < this.productList.length; i++) {
        this.arrayRowData = this.productList[i].data;
        this.arrayRowData.sr_no = i + 1;
        this.arrayRowData.id = this.productList[i].id;
        this.arrayTableData.push(this.arrayRowData);
      }
      this.eachRowData = this.arrayTableData;
    });
  }

  storesTabClicked() {
    this.getVendorStores()
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.arrayTableData.filter(function (d) {
      if (d.name != '' && d.name != null) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.eachRowData = temp;
    this.table.offset = 0;
  }

  productsFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.arrayTableData.filter(function (d) {
      if (d.name != '' && d.name != null) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.eachRowData = temp;
    this.table.offset = 0;
  }

  ordersTabClicked() {
    this.getVendorProducts()
  }

}

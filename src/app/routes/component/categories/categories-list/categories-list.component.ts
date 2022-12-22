import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import "firebase/functions";

const swal = require('sweetalert');
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesListComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Categories: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  constructor(
    private categoryService: CategoryService,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategoryList().subscribe(res => {
      this.Categories = [];
      this.Categories = res.map(e => {
        let data = e.payload.doc.data()

        return {
          id: e.payload.doc.id,
          data
        }
      })
      // console.log('categories',this.Categories);

      // set data for datatable start---------------
      this.arrayTableData = [];
      for (let i = 0; i < this.Categories.length; i++) {
        this.arrayRowData = this.Categories[i].data;
        this.arrayRowData.sr_no = i + 1;
        this.arrayRowData.id = "CAT:" + this.Categories[i].id;
        this.arrayTableData.push(this.arrayRowData);
      }
      this.rowsFilter = this.arrayTableData;
      // console.log('this.rowsFilter', this.rowsFilter)
      // set data for datatable end---------------
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

  deleteCategoryData(id) {
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
        this.categoryService.deleteCategory(_id).then(() => {
          this.afs.collection("settings").doc('counts').update({
            'counts.categories': firebase.firestore.FieldValue.increment(1)
          }).then((res) => {
            swal('Deleted!', 'Data deletd!', 'success');
          });
        })
      }
    });
  }


}

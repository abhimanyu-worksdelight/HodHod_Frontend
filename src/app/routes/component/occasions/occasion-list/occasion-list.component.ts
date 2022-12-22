import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { OccasionsService } from '../../../services/occasions/occasions.service';

const swal = require('sweetalert');

@Component({
  selector: 'app-occasion-list',
  templateUrl: './occasion-list.component.html',
  styleUrls: ['./occasion-list.component.scss']
})
export class OccasionListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  HomeSections: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  constructor(
    private occasionsService: OccasionsService,
  ) { }

  ngOnInit(): void {
    this.occasionsService.getOccasionsList().subscribe(res => {
      this.HomeSections = [];
      this.HomeSections = res.map(e => {
        let data = e.payload.doc.data();

        return {
          id: e.payload.doc.id,
          data
        }
      })
      // console.log('HomeSections',this.HomeSections);

      // set data for datatable start---------------
      this.arrayTableData = [];
      for (let i = 0; i < this.HomeSections.length; i++) {
        this.arrayRowData = this.HomeSections[i].data;
        this.arrayRowData.sr_no = i + 1;
        this.arrayRowData.id = "OCC:" + this.HomeSections[i].id;
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
      if (d.title != '' && d.title != null) {
        return d.title.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    // update the rows
    this.rowsFilter = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  // search datatable data end--------------

  deleteOccasionsData(id) {
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
        this.occasionsService.deleteOccasions(_id).then(() => {
          swal('Deleted!', 'Data deletd!', 'success');
        })
      }
    });
  }

}

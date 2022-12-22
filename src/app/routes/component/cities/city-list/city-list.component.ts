import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CitiesService } from '../../../services/cities/cities.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

const swal = require('sweetalert');

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CityListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Cities: any = [];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  constructor(
    private citiesService: CitiesService,
  ) { }

  ngOnInit(): void {
    this.citiesService.getCitiesList().subscribe(res => {
      this.Cities = [];
      this.Cities = res.map(e => {
        let data = e.payload.doc.data();

        return {
          id: e.payload.doc.id,
          data
        }
      })
      // console.log('Cities',this.Cities);

      // set data for datatable start---------------
      this.arrayTableData = [];
      for (let i = 0; i < this.Cities.length; i++) {
        this.arrayRowData = this.Cities[i].data;
        this.arrayRowData.sr_no = i + 1;
        this.arrayRowData.id = "CTY:" + this.Cities[i].id;

        if (this.Cities[i].data.original_loc) {
          this.arrayRowData.original_loc = this.Cities[i].data.original_loc.split(',')[0] || '--';
        } else {
          this.arrayRowData.original_loc = '--';
        }
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
      if (d.original_loc != '' && d.original_loc != null) {
        return d.original_loc.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    // update the rows
    this.rowsFilter = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  // search datatable data end--------------

  deleteCitiesData(id) {
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
        this.citiesService.deleteCities(_id).then(() => {
          swal('Deleted!', 'Data deletd!', 'success');
        })
      }
    });
  }

}

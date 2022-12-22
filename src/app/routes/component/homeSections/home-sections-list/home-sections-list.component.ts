import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HomeSectionsService } from '../../../services/homeSections/home-sections.service';

const swal = require('sweetalert');

@Component({
  selector: 'app-home-sections-list',
  templateUrl: './home-sections-list.component.html',
  styleUrls: ['./home-sections-list.component.scss']
})
export class HomeSectionsListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  HomeSections: any=[];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  constructor(
    private homeSectionsService: HomeSectionsService,
  ) { }

  ngOnInit(): void {
    this.homeSectionsService.getHomeSectionsList().subscribe(res => {
      this.HomeSections = [];
      this.HomeSections = res.map( e => {
        let data = e.payload.doc.data();

        return {
          id: e.payload.doc.id, 
          data
        }
      })
      // console.log('HomeSections',this.HomeSections);

      // set data for datatable start---------------
      this.arrayTableData = [];
      for(let i=0; i<this.HomeSections.length; i++){
        this.arrayRowData = this.HomeSections[i].data;
        this.arrayRowData.sr_no = i+1;
        this.arrayRowData.id ="SEC:"+ this.HomeSections[i].id;
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

  deleteHomeSectionsData(id){
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
        this.homeSectionsService.deleteHomeSections(_id).then(() => {
          swal('Deleted!', 'Data deletd!', 'success');
        })
      }
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TagsService } from '../../../services/tags/tags.service';

const swal = require('sweetalert');
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Tags: any=[];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  constructor(
    private tagsService: TagsService,
  ) { }

  ngOnInit(): void {
    this.Tags = [];
    this.tagsService.getTagsList().subscribe(res => {
      this.Tags = [];
      this.Tags = res.map( e => {
        let data = e.payload.doc.data();

        return {
          id: e.payload.doc.id, 
          data
        }
      })
      // console.log('Tags',this.Tags);

      // set data for datatable start---------------
      this.arrayTableData = [];
      for(let i=0; i<this.Tags.length; i++){
        this.arrayRowData = this.Tags[i].data;
        this.arrayRowData.sr_no = i+1;
        this.arrayRowData.id ="TAG:"+ this.Tags[i].id;
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

  deleteTagsData(id){
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
        this.tagsService.deleteTags(_id).then(() => {
          swal('Deleted!', 'Data deletd!', 'success');
        })
      }
    });
  }

}

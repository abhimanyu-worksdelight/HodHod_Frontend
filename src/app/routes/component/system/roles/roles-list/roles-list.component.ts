import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { RolesService } from '../../../../services/system/roles/roles.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

const swal = require('sweetalert');

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  Roles: any=[];
  arrayRowData: any = "";
  rowsFilter = [];
  arrayTableData: any = [];
  sr_no: number;

  constructor(
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    this.rolesService.getRolesList().subscribe(res => {
      this.Roles = [];
      this.Roles = res.map( e => {
        let data = e.payload.doc.data();

        return {
          id: e.payload.doc.id, 
          data
        }
      })
      // console.log('Roles',this.Roles);

      // set data for datatable start---------------
      this.arrayTableData = [];
      for(let i=0; i<this.Roles.length; i++){
        this.arrayRowData = this.Roles[i].data;
        this.arrayRowData.sr_no = i+1;
        this.arrayRowData.id = this.Roles[i].id;
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

  deleteRolesData(id){
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
        this.rolesService.deleteRoles(_id).then(() => {
          swal('Deleted!', 'Data deletd!', 'success');
        })
      }
    });
  }

}

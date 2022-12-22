import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FaqService } from '../../../services/faq/faq.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  FAQList : any
  filteredData = [];

  constructor(
    private faqService: FaqService
  ) { }
  

  ngOnInit(): void {
    this.faqService.getFaqList().subscribe(res => {
      this.FAQList = res.map( e => {
        let data:Object = e.payload.doc.data()
        return {
          id: e.payload.doc.id, 
          ...data
        }
      })
      
      let list = []
      for(let i=0; i<this.FAQList.length; i++){
        let obj = {};
        obj = this.FAQList[i];
        obj['sr_no'] = i+1;
        obj['id'] = "FAQ:"+this.FAQList[i].id;
        list.push(obj);
      }
      this.filteredData = list;
      // console.log('this.filteredData', this.filteredData)
    });
  }

  /**
   * 
   * @param event 
   */
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const list = this.FAQList.filter(function(d) {
      if(d.question != '' && d.question != null){
        return d.question.toLowerCase().indexOf(val) !== -1 || d.answer.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.filteredData = list;
    this.table.offset = 0;
  }

  deleteFAQ = (id) => {
    this.sweetalertWarning(id);
  }

  sweetalertWarning(_id) {
    swal({
      title: 'Are you sure?',
      text: 'Want to delete FAQ!',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: "",
          closeModal: false
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
        this.faqService.deleteFAQ(_id);
        swal('Deleted!', 'FAQ Deleted Successfully!', 'success');
      } else {
        swal('Cancelled', 'Data is safe :)', 'error');
      }
    });
  }

}

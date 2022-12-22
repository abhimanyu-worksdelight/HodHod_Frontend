import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../services/faq/faq.service';

declare var $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  FAQList : any

  constructor(
    private faqService: FaqService
  ) { }
  

  ngOnInit(): void {
    this.faqService.getFaqList().subscribe(res => {
      this.FAQList = res.map( e => {
        let data = e.payload.doc.data()
        return {
          id: e.payload.doc.id, 
          data
        }
      })
      console.log('this.FAQList', this.FAQList)
    });
  }

  onAccordionClick(className) {
    $(`.${className}`).find('.accordion-item').toggleClass('active');
  }


}

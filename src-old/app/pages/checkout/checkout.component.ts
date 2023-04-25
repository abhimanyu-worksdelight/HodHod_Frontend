import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  id: string = '';
  quantity: any = '';
  productDetail: any = [];
  totalPrice: any;
  occasionData: any = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
    // get id and quantity from url
    this.id = this.route.snapshot.params['id'];
    this.quantity = this.route.snapshot.params['quantity'];

    this.homeService.getProductDetail(this.id).then((doc) => {
      if(doc){
        this.productDetail = doc[0];
        // console.log('this.productDetail', this.productDetail);

        // total product price
        if(this.productDetail.data.price){
          this.totalPrice = this.productDetail.data.price * this.quantity;
          
        }else{
          this.totalPrice = 0;
        }
      }
    });

    // get occasion list data
    this.getOccasionList();

  }

  getOccasionList(){
    this.homeService.getOccasionList().then((res) => {
      if(res.length){
        this.occasionData = [];
        res.forEach((item: any) => {
          this.occasionData.push({
            id: item.id,
            data: item.data()
          });
        });
        console.log('this.occasionData', this.occasionData);
      }
    });
  }

}

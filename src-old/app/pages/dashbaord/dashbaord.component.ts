import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.css']
})
export class DashbaordComponent implements OnInit {
  @Input() Hero: any;

  categoryslides: any = [];
  slideConfig = { slidesToShow: 5, slidesToScroll: 1, infinite: true, responsive:[{ breakpoint: 767, settings:{slidesToShow: 3}}, { breakpoint: 576, settings:{slidesToShow: 2}}]};
  quantity: number = 1;
  slectedCity: any;

  categorySlide(){
    this.categoryslides = [];
    this.homeService.getCategoryList().then(catRes => {
      if(catRes){
        catRes.map((item: any) => {
          this.categoryslides.push({
            image: item.data.image,
            title: item.data.name,
            color: item.data.color,
            id: item.id
          });
        });
      }
    });
  }

  featureProductslides: any = [];
  slideConfig1 = { slidesToShow: 4, slidesToScroll: 1 , infinite: true, responsive:[{ breakpoint: 767, settings:{slidesToShow: 3}}, { breakpoint: 576, settings:{slidesToShow: 2}}]};
  featureProductSlide(){
    this.featureProductslides = [];
    this.homeService.getFeatureProductList().then(featureProductData => {
      if(featureProductData){
        featureProductData.map((item: any) => {
          this.featureProductslides.push({
            image: item.data.image,
            title: item.data.name,
            description: item.data.description,
            price: item.data.price,
            id: item.id
          });
        });      
      }
    });
  }

  /**** Ternding Products ****/
  trendingslides: any = [];
  slideConfig2 = { slidesToShow: 4, slidesToScroll: 1 , infinite: true, responsive:[{ breakpoint: 767, settings:{slidesToShow: 3}}, { breakpoint: 576, settings:{slidesToShow: 2}}]};
  trendingProductSlide(){
    this.trendingslides = [];
    this.homeService.getTrendingProductList().then(trendingProductData => {
      if(trendingProductData){
        trendingProductData.map((item: any) => {
          this.trendingslides.push({
            image: item.data.image,
            title: item.data.name,
            description: item.data.description,
            price: item.data.price,
            id: item.id
          });
        });
      }
    });
  }

  removeSlide() {
    this.categoryslides.length = this.categoryslides.length - 1;
  }

  slickInit(e: any) {
    // console.log('slick initialized');
  }

  breakpoint(e: any) {
    // console.log('breakpoint');
  }

  afterChange(e: any) {
    // console.log('afterChange');
  }

  beforeChange(e: any) {
    // console.log('beforeChange');
  }

  constructor(
    private homeService: HomeService,
  ) {}

  ngOnInit(): void {
    // get category product
    this.categorySlide();

    // get featured product
    this.featureProductSlide();

    // get trending product
    this.trendingProductSlide();
  }

  increment(){
    this.quantity = ++this.quantity;
    // console.log('this.quantity', this.quantity);
  }

  decrement(){
    if(this.quantity > 1){
      this.quantity = --this.quantity;
      // console.log('this.quantity', this.quantity);
    }
  }
  
}
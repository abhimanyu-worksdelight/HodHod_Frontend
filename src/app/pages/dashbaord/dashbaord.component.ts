import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.css']
})
export class DashbaordComponent implements OnInit {

  quantity: number = 1;
  slectedCity: any;
  tagItemArr: any = [];
  productlist: any = [];
  categoriesData: any = [];
  allProductFilterlist: any = [];
  isLoading: boolean = false;
  lowerVal: number = 135;
  upperVal: number = 500;
  list: any[] | undefined;
  style = {
    'width': '22%',
    'height': '200px',
    'margin': '10px'
  };
  isVisible: boolean = true;

  categoryData() {
    this.categoriesData = [];
    this.homeService.getCategoryList().then(catRes => {
      if (catRes) {
        catRes.map((item: any) => {
          this.categoriesData.push({
            image: item.data.image,
            title: item.data.name,
            color: item.data.color,
            id: item.id
          });
        });
        console.log(this.categoriesData)
        localStorage.setItem('selected_cat_id', this.categoriesData[0].id);
        $('.category_box .row .col-6').click(function () {
          $('.category_box .row .col-6').addClass('active_cat').siblings().removeClass('active_cat');
        });

      }
    });
  }

  constructor(
    private homeService: HomeService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    // get category product
    this.categoryData();

    // get product list
    this.getProductList();

    this.homeService.getTagList().then(tagRes => {
      this.tagItemArr = tagRes;
      // console.log('this.tagItemArr', this.tagItemArr);
    });

    // setTimeout(() => {
    //   this.list = [1, 2, 4];
    // }, 10000);
  }

  valueLowerChanged(e: any) {
    $('#one').val(e.value);
  }

  valueUpperChanged(e: any) {
    $('#two').val(e.value);
  }

  getProductList() {
    this.isVisible = true;
    this.productlist = [];
    this.homeService.getProductList().then(res => {
      this.isLoading = true;
      if (res.length) {
        res.map((item: any) => {
          this.productlist.push({
            id: item.id,
            image: item.data.image,
            title: item.data.name,
            description: item.data.description,
            price: item.data.price
          });
          this.allProductFilterlist = [...this.productlist];
        });
        this.isLoading = false;
        this.isVisible = false;
      } else {
        this.isLoading = false;
        this.isVisible = false;
        console.log('Data not found!');
      }
    }).catch((err) => {
      this.isLoading = false;
      this.isVisible = false;
    });
  }

  // getCategoryProductData(id: any){
  //   this.productlist = [];
  //   this.homeService.getCategoryProductList(id).then(res => {
  //     this.isLoading = true;
  //     if(res.length){
  //       res.map((item: any) => {
  //         this.productlist.push({
  //           id: item.id,
  //           image: item.data.image,
  //           title: item.data.name,
  //           description: item.data.description,
  //           price: item.data.price
  //         });
  //         this.allProductFilterlist = [...this.productlist];
  //       });
  //       this.isLoading = false;
  //     }else{
  //       this.isLoading = false;
  //       console.log('Data not found!');
  //     }
  //   }).catch((err) => {
  //     this.isLoading = false;
  //   });
  // }

  // getTagProductData(id: any){
  //   this.productlist = [];
  //   this.homeService.getTagProductList(id).then(res => {
  //     this.isLoading = true;
  //     if(res.length){
  //       res.map((item: any) => {
  //         this.productlist.push({
  //           id: item.id,
  //           image: item.data.image,
  //           title: item.data.name,
  //           description: item.data.description,
  //           price: item.data.price
  //         });
  //         this.allProductFilterlist = [...this.productlist];
  //       });
  //       this.isLoading = false;
  //     }else{
  //       this.isLoading = false;
  //       console.log('Data not found!');
  //     }
  //   }).catch((err) => {
  //     this.isLoading = false;
  //   });
  // }

  // filterRangeProduct(){
  //   let lower = $('#lower').val();
  //   let upper = $('#upper').val();
  //   this.productlist = [];
  //   this.homeService.getPriceFilterProductList(lower, upper).then(res => {
  //     this.isLoading = true;
  //     if(res.length){
  //       res.map((item: any) => {
  //         this.productlist.push({
  //           id: item.id,
  //           image: item.data.image,
  //           title: item.data.name,
  //           description: item.data.description,
  //           price: item.data.price
  //         });
  //         this.allProductFilterlist = [...this.productlist];
  //       });
  //       this.isLoading = false;
  //     }else{
  //       this.isLoading = false;
  //       console.log('Data not found!');
  //     }
  //   }).catch((err) => {
  //     this.isLoading = false;
  //   });
  // }

  getCategoryProductData(id: any) {
    $('.category_box .row .col-6').click(function () {
      $(this).addClass('active_cat').siblings().removeClass('active_cat');
    });

    this.productlist = [];
    this.isLoading = true;
    this.isVisible = true;

    localStorage.setItem('selected_cat_id', id);
    if (id) {
      this.productlist = [];


      // localStorage.setItem('selectedCityId', city);
      // window.location.reload();

      this.homeService.getCityVendorsForCategories(id, localStorage.getItem('selectedCityId')).then(productsCityBased => {
        console.log("productsCityBased.size ", productsCityBased.size)
        if (productsCityBased.size != 0) {
          productsCityBased.map((item: any) => {
            this.productlist.push({
              id: item.id,
              image: item.image,
              title: item.name,
              description: item.description,
              price: item.price
            });
          });
          console.log("productlist...", this.productlist.length)


        } else {
          this.productlist = [];
        }
        // else {
        // this.productlist = []
        // this.isVisible = false;
        // }
        // if(productsCityBased){
        //   console.log("productsCityBased...",productsCityBased)
        // }
      });
      this.isVisible = false;
    } else {
      localStorage.setItem('selectedCityId', 'PTMLDUiLrIpv8a0agSmi');
      this.isVisible = false;
    }
    // this.homeService.getFilterProductList().then((res) => {
    //   if (res.length) {
    //     res.map((item: any) => {
    //       this.productlist.push({
    //         id: item.id,
    //         image: item.data.image,
    //         title: item.data.name,
    //         description: item.data.description,
    //         price: item.data.price
    //       });
    //       this.allProductFilterlist = [...this.productlist];
    //     });
    //     this.isLoading = false;
    //     this.isVisible = false;
    //   } else {
    //     this.isLoading = false;
    //     this.isVisible = false;
    //     console.log('Data not found!');
    //   }
    // }).catch((err) => {
    //   console.log('err', err);
    //   this.isLoading = false;
    //   this.isVisible = false;
    // });
  }

  getTagProductData(id: any) {
    this.isVisible = true;

    $('.sidebar_tag li').click(function () {
      $(this).addClass('active_tag').siblings().removeClass('active_tag');
    });

    this.productlist = [];
    this.isLoading = true;
    localStorage.setItem('selected_tag_id', id);
    this.homeService.getFilterProductList().then((res) => {
      if (res.length) {
        res.map((item: any) => {
          this.productlist.push({
            id: item.id,
            image: item.data.image,
            title: item.data.name,
            description: item.data.description,
            price: item.data.price
          });
          this.allProductFilterlist = [...this.productlist];
        });
        this.isLoading = false;
        this.isVisible = false;
      } else {
        this.isLoading = false;
        this.isVisible = false;
        console.log('Data not found!');
      }
    }).catch((err) => {
      console.log('err', err);
      this.isLoading = false;
      this.isVisible = false;
    });
  }

  filterRangeProduct() {
    this.productlist = [];
    this.isLoading = true;
    this.isVisible = true;

    let lower: any = $('#lower').val();
    let upper: any = $('#upper').val();
    localStorage.setItem('lower', lower);
    localStorage.setItem('upper', upper);

    this.homeService.getFilterProductList().then((res) => {
      if (res.length) {
        res.map((item: any) => {
          this.productlist.push({
            id: item.id,
            image: item.data.image,
            title: item.data.name,
            description: item.data.description,
            price: item.data.price
          });
          this.allProductFilterlist = [...this.productlist];
        });
        this.isLoading = false;
        this.isVisible = false;
      } else {
        this.isLoading = false;
        this.isVisible = false;
        console.log('Data not found!');
      }
    }).catch((err) => {
      console.log('err', err);
      this.isLoading = false;
      this.isVisible = false;
    });
  }

  clearFilter() {
    $('.category_box .row .col-6').removeClass('active_cat');
    $('.sidebar_tag li').removeClass('active_tag');

    this.isVisible = true;
    this.getProductList();
  }

  onSelectType(productType: any) {
    this.isVisible = true;

    let pType = productType.target.value;
    if (pType == 'Featured') {
      this.productlist = [];
      this.homeService.getFeatureProductList().then(featureProductData => {
        if (featureProductData) {
          featureProductData.map((item: any) => {
            this.productlist.push({
              image: item.data.image,
              title: item.data.name,
              description: item.data.description,
              price: item.data.price,
              id: item.id
            });
          });
          this.isVisible = false;
        }
      });

    } else if (pType == 'Trending') {
      this.productlist = [];
      this.homeService.getTrendingProductList().then(trendingProductData => {
        if (trendingProductData) {
          trendingProductData.map((item: any) => {
            this.productlist.push({
              image: item.data.image,
              title: item.data.name,
              description: item.data.description,
              price: item.data.price,
              id: item.id
            });
          });
          this.isVisible = false;
        }
      });

    } else if (pType == 'Default Sorting') {
      this.isVisible = true;
      this.productlist = [];
      setTimeout(() => {
        this.productlist = this.allProductFilterlist;
        this.isVisible = false;
      }, 1000);

    } else {
      this.isVisible = false;
    }
  }

  onProductInputSearch(filterBy: any) {
    filterBy = filterBy.target.value.toLowerCase();
    if (filterBy != '') {
      this.productlist = this.allProductFilterlist.filter((product: any) =>
        product.title.toLowerCase().indexOf(filterBy) !== -1);
    } else {
      this.productlist = this.allProductFilterlist;
    }
  }

  onCitySelectChange(city: any): void {
    this.isVisible = true;
    console.log('city', city);
    if (city) {
      this.productlist = [];

      localStorage.setItem('selectedCityId', city);
      // window.location.reload();

      this.homeService.getCityVendors(city).then(productsCityBased => {
        console.log("productsCityBased.size ", productsCityBased.size)
        if (productsCityBased.size != 0) {
          productsCityBased.map((item: any) => {
            this.productlist.push({
              id: item.id,
              image: item.image,
              title: item.name,
              description: item.description,
              price: item.price
            });
          });
          console.log("productlist...", this.productlist.length)


        } else {
          this.productlist = [];
        }

      });
      this.isVisible = false;
    } else {
      localStorage.setItem('selectedCityId', 'PTMLDUiLrIpv8a0agSmi');
      this.isVisible = false;
    }
  }


  increment() {
    this.quantity = ++this.quantity;
    // console.log('this.quantity', this.quantity);
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity = --this.quantity;
      // console.log('this.quantity', this.quantity);
    }
  }

}
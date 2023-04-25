import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { AuthService } from '../../authentication/auth.service';
@Component({
  selector: 'app-productlisting',
  templateUrl: './productlisting.component.html',
  styleUrls: ['./productlisting.component.css']
})
export class ProductlistingComponent implements OnInit {
    id: string = '';
    shoplist: any = [];
    allShopFilterlist: any = [];
    categoryItemArr:any = [];
    tagItemArr:any = [];
    OTP: any = '';
    quantity: number = 1;
    isLoading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private homeService: HomeService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // get id from url
        this.id = this.route.snapshot.params['id'];

        this.homeService.getCategoryList().then(catRes => {
            this.categoryItemArr = catRes;
            // console.log('this.categoryItemArr', this.categoryItemArr);
        });

        this.homeService.getTagList().then(tagRes => {
            this.tagItemArr = tagRes;
            // console.log('this.tagItemArr', this.tagItemArr);
        });

        this.homeService.getCategoryProductList(this.id).then(res => {
            this.isLoading = true;
            this.shoplist = [];    
            if(res.length){
                res.map((item: any) => {
                    this.shoplist.push({
                        id: item.id,
                        image: item.data.image,
                        title: item.data.name,
                        description: item.data.description,
                        price: item.data.price
                    });
                    this.allShopFilterlist = [...this.shoplist];
                });
                this.isLoading = false;
            }else{
                this.isLoading = false;
                console.log('Data not found!');
            }
        }).catch((err) => {
            this.isLoading = false;
            console.log('Error: ' + err);
        });
    }

    getCategoryProductData(id: any){
        this.shoplist = [];
        this.homeService.getCategoryProductList(id).then(res => {
            this.isLoading = true;
            if(res.length){
                res.map((item: any) => {
                    this.shoplist.push({
                        id: item.id,
                        image: item.data.image,
                        title: item.data.name,
                        description: item.data.description,
                        price: item.data.price
                    });
                    this.allShopFilterlist = [...this.shoplist];
                });
                this.isLoading = false;
            }else{
                this.isLoading = false;
                console.log('Data not found!');
            }
        }).catch((err) => {
            this.isLoading = false;
        });
    }

    getTagProductData(id: any){
        this.shoplist = [];
        this.homeService.getTagProductList(id).then(res => {
            this.isLoading = true;
            if(res.length){
                res.map((item: any) => {
                    this.shoplist.push({
                        id: item.id,
                        image: item.data.image,
                        title: item.data.name,
                        description: item.data.description,
                        price: item.data.price
                    });
                    this.allShopFilterlist = [...this.shoplist];
                });
                this.isLoading = false;
            }else{
                this.isLoading = false;
                console.log('Data not found!');
            }
        }).catch((err) => {
            this.isLoading = false;
        });
    }

    filterRangeProduct(){
        let lower = $('#lower').val();
        let upper = $('#upper').val();
        this.shoplist = [];
        this.homeService.getPriceFilterProductList(lower, upper).then(res => {
            this.isLoading = true;
            if(res.length){
                res.map((item: any) => {
                    this.shoplist.push({
                        id: item.id,
                        image: item.data.image,
                        title: item.data.name,
                        description: item.data.description,
                        price: item.data.price
                    });
                    this.allShopFilterlist = [...this.shoplist];
                });
                this.isLoading = false;
            }else{
                this.isLoading = false;
                console.log('Data not found!');
            }
        }).catch((err) => {
            this.isLoading = false;
        });
    }

    onSelectType(productType: any) {
        let pType = productType.target.value;
        if(pType == 'Featured'){
            this.shoplist = [];
            this.homeService.getFeatureProductList().then(featureProductData => {
                if(featureProductData){
                    featureProductData.map((item: any) => {
                        this.shoplist.push({
                            image: item.data.image,
                            title: item.data.name,
                            description: item.data.description,
                            price: item.data.price,
                            id: item.id
                        });
                    });      
                }
            });

        }else if(pType == 'Trending'){
            this.shoplist = [];
            this.homeService.getTrendingProductList().then(trendingProductData => {
                if(trendingProductData){
                    trendingProductData.map((item: any) => {
                        this.shoplist.push({
                            image: item.data.image,
                            title: item.data.name,
                            description: item.data.description,
                            price: item.data.price,
                            id: item.id
                        });
                    });
                }
            });

        }else if(pType == 'Deafult Sorting'){
            this.shoplist = this.allShopFilterlist;
        }
    }

    onProductSearchFilter(filterBy: any) {
        filterBy = filterBy.target.value.toLowerCase();
        if(filterBy != ''){
            this.shoplist = this.allShopFilterlist.filter((product: any) =>
                product.title.toLowerCase().indexOf(filterBy) !== -1);
        }else{
            this.shoplist = this.allShopFilterlist;
        }
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

    logout(){
        this.authService.signout();
    }

    onCitySelectChange(city: any): void {
        console.log('city', city);
        if(city){
          localStorage.setItem('selectedCityId', city);
          window.location.reload();
        }else{
          localStorage.setItem('selectedCityId', 'PTMLDUiLrIpv8a0agSmi');
        }
      }

}

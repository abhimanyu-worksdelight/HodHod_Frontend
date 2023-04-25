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
    categoryItemArr:any = [];
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

        this.homeService.getCategoryProductList(this.id).then(res => {
            this.isLoading = true;
            this.shoplist = [];    
            if(res.length){
                res.map((item: any) => {
                    this.shoplist.push({
                        id: item.id,
                        image: item.data.image,
                        title: item.data.title,
                        description: item.data.description,
                        price: item.data.price
                    });
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
        this.isLoading = true;
        this.shoplist = [];
        this.homeService.getCategoryProductList(id).then(res => {
            if(res.length){
                res.map((item: any) => {
                    this.shoplist.push({
                        id: item.id,
                        image: item.data.image,
                        title: item.data.title,
                        description: item.data.description,
                        price: item.data.price
                    });
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

}

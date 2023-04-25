import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  catProductData:any = [];
  tagProductData:any = [];
  categoryData:any = [];
  tagData:any = [];
  featureProductData: any = [];
  trendingProductData: any = [];
  priceProductData: any = [];
  productDetail: any = [];
  cityData: any = [];
  occasionData: any = [];
  selectedCityId: any = '';

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    
  }

  getCategoryList():Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.afs.collection('categories').get().subscribe(catRes => {
        this.categoryData = [];
        if(catRes.size){
          catRes.forEach(catItem => {
            this.categoryData.push(
              { 
                id: catItem.id,
                data: catItem.data()
              }
            );
          });
          resolve(this.categoryData);
        }else{
          reject(0);
        }
      })
    }));
  }

  getTagList():Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.afs.collection('tags').get().subscribe(tagRes => {
        this.tagData = [];
        if(tagRes.size){
          tagRes.forEach(tagItem => {
            this.tagData.push(
              { 
                id: tagItem.id,
                data: tagItem.data()
              }
            );
          });
          resolve(this.tagData);
        }else{
          reject(0);
        }
      })
    }));
  }

  getFeatureProductList():Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach(shopItem => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(featureProductRes => {
            this.featureProductData = [];
            if(featureProductRes.size){
              featureProductRes.forEach(item => {
                let fpData: any = item.data();
                if(fpData.inSection_id.includes('2ld91WaeDyh6qAeWR4EQ')){
                  this.featureProductData.push(
                    {
                      id: item.id,
                      data: item.data()
                    }
                  );
                }
              });
              resolve(this.featureProductData);
            }else{
              reject(0);
            }
          });
        });
      });
    })) 
  }

  getTrendingProductList():Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach(shopItem => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(trendingProductRes => {
            this.trendingProductData = [];
            if(trendingProductRes.size){
              trendingProductRes.forEach(item => {
                let tpData: any = item.data();
                if(tpData.inSection_id.includes('aaFNfNYPHKHFHd9byUB9')){
                  this.trendingProductData.push(
                    {
                      id: item.id,
                      data: item.data()
                    }
                  );
                }
              });
              resolve(this.trendingProductData);

            }else{
              reject(0);
            }
          });
        });
      });
    }));
  }

  getCategoryProductList(id: any):Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach(shopItem => {
          this.afs.collection('products', ref => ref.where('cat_id', '==', id).where('store_id', 'array-contains', shopItem.id)).get().subscribe(res => {
            this.catProductData = [];
            if(res.size){
              res.forEach(catItem => {
                this.catProductData.push(
                  {
                    id: catItem.id,
                    data: catItem.data()
                  }
                );
                resolve(this.catProductData);
              });

            }else{
              reject(0);
            }
          })
        });
      });
    }))
  }

  getTagProductList(id: any):Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach(shopItem => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(res => {
            this.tagProductData = [];
            let tagPData: any = [];
            if(res.size){
              res.forEach(tagItem => {
                tagPData = tagItem.data();
                if(tagPData.tag_id.includes(id)){
                  this.tagProductData.push(
                    {
                      id: tagItem.id,
                      data: tagItem.data()
                    }
                  );
                  resolve(this.tagProductData);
                }
              });

            }else{
              reject(0);
            }
          })
        });
      });
    }))
  }

  getPriceFilterProductList(low: any, high: any):Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach(shopItem => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(res => {
            this.priceProductData = [];
            let pricePData: any = [];
            if(res.size){
              res.forEach(priceProductItem => {
                pricePData = priceProductItem.data();
                if(pricePData.price >= low && pricePData.price <= high){
                  this.priceProductData.push(
                    {
                      id: priceProductItem.id,
                      data: priceProductItem.data()
                    }
                  );
                  resolve(this.priceProductData);
                }
              });

            }else{
              reject(0);
            }
          })
        });
      });
    }))
  }

  getProductDetail(id: any):Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.afs.collection('products', ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id)).get().subscribe(res => {
        this.productDetail = [];
        if(res){
          this.productDetail.push(
            {
              id: res.docs[0].id,
              data: res.docs[0].data()
            }
          );
          resolve(this.productDetail);
        }else{
          reject(0);
        }
      });
    }));
  }

  getCityList():Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.afs.collection('cities').get().subscribe(citiesRes => {
        this.cityData = [];
        if(citiesRes){
          citiesRes.forEach(cityItem => {
            this.cityData.push(cityItem);
          });
          resolve(this.cityData);
        }else{
          reject(0);
        }
      });
    }));
  }

  getOccasionList():Promise<any>{
    return new Promise<any>(((resolve, reject)=>{
      this.afs.collection('occasions').get().subscribe(occasionsRes => {
        this.occasionData = [];
        if(occasionsRes){
          occasionsRes.forEach(occasionItem => {
            this.occasionData.push(occasionItem);
          });
          resolve(this.occasionData);
        }else{
          reject(0);
        }
      });
    }));
  }

}

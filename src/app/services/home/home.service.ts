import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  catProductData: any = [];
  tagProductData: any = [];
  categoryData: any = [];
  tagData: any = [];
  featureProductData: any = [];
  trendingProductData: any = [];
  priceProductData: any = [];
  productDetail: any = [];
  cityData: any = [];
  occasionData: any = [];
  productData: any = [];
  selectedCityId: any = '';

  selected_cat_id: any;
  selected_tag_id: any;
  upper: any;
  lower: any;
  vendorIdData: any = [];
  vendorData: any = [];
  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {

  }

  getProductList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('products', ref => ref.where('cat_id', '==', localStorage.getItem('selected_cat_id'))).get().subscribe(productRes => {
        this.productData = [];
        if (productRes.size) {
          productRes.forEach((productItem: any) => {
            this.productData.push(
              {
                id: productItem.id,
                data: productItem.data()
              }
            );
          });
          resolve(this.productData);
        } else {
          reject(0);
        }
      })
    }));
  }

  getCityVendors(cityId: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('vendors', ref => ref.where('city_id', 'array-contains', cityId)).get().subscribe(cityVendors => {
        this.vendorIdData = []
        if (cityVendors) {
          cityVendors.forEach((vendorItem: any) => {
            this.vendorData.push(vendorItem.data());
            this.vendorIdData.push(vendorItem.id);
          });
          console.log("cityVendors ", this.vendorIdData.length)
          if (this.vendorIdData.length > 0) {
            this.getProductsBasedOnCity(this.vendorIdData).then((res) => {
              resolve(res);
            })
          } else {
            reject("No Vendors found");
          }

        } else {
          reject(0);

        }
      });
    }));
  }
  getCityVendorsForCategories(catId: any, cityId: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('vendors', ref => ref.where('city_id', 'array-contains', cityId)).get().subscribe(cityVendors => {
        this.vendorIdData = []
        if (cityVendors) {
          cityVendors.forEach((vendorItem: any) => {
            this.vendorData.push(vendorItem.data());
            this.vendorIdData.push(vendorItem.id);
          });
          console.log("cityVendors ", this.vendorIdData.length)
          if (this.vendorIdData.length > 0) {
            this.selected_cat_id = localStorage.getItem('selected_cat_id');
            this.getProductsBasedOnCityForCategories(this.vendorIdData, this.selected_cat_id).then((res) => {
              resolve(res);
            })
          } else {
            reject("No Vendors found");
          }

        } else {
          reject(0);

        }
      });
    }));
  }

  // getSelectedVendors(): Promise<any> {
  //   return new Promise<any>(((resolve, reject) => {
  //     this.afs.collection('vendors', ref => ref.where('city_id', 'array-contains', cityId)).get().subscribe(cityVendors => {
  //       this.vendorIdData = []
  //       if (cityVendors) {
  //         cityVendors.forEach(vendorItem => {
  //           this.vendorData.push(vendorItem.data());
  //           this.vendorIdData.push(vendorItem.id);
  //         });
  //         console.log("cityVendors ", this.vendorIdData.length)
  //         if (this.vendorIdData.length > 0) {
  //           this.getProductsBasedOnCity(this.vendorIdData).then((res) => {
  //             resolve(res);
  //           })
  //         } else {
  //           reject("No Vendors found");
  //         }

  //       } else {
  //         reject(0);

  //       }
  //     });
  //   }));
  // }

  getProductsBasedOnCityUpdated(vendorArr: any) {

    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < vendorArr.length; i += chunkSize) {
      chunks.push(vendorArr.slice(i, i + chunkSize));
    }

    const queries = chunks.map(chunk => {
      return this.afs.collection('products', ref => ref.where('vendor_id', 'in', chunk)).get();
    });

    Promise.all(queries).then(results => {
      // var productss = [];
      results.forEach(result => {
        result.forEach(docR => {
          // productss.push(docR.data());
          console.log("docR  ", docR);

        });
      });
      // console.log('Products:', productss);
    }).catch(error => {
      console.error('Error getting products:', error);
    });
  }

  getProductsBasedOnCityForCategories(vendorIdsArr: any, catId: any): Promise<any> {

    if (vendorIdsArr.length > 10) {
      vendorIdsArr = vendorIdsArr.slice(0, 10)
    }
    console.log("vendorArr ", vendorIdsArr)
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('products', ref => ref.where('vendor_id', 'in', vendorIdsArr).where('cat_id', '==', catId)).get().subscribe(cityBasedProducts => {
        console.log("cityBasedProducts ", cityBasedProducts.size)
        if (cityBasedProducts) {
          //   resolve(cityBasedProducts);
          // }
          const productsArray = cityBasedProducts.docs.map((product: any) => product.data());
          console.log("productsArray ", productsArray)

          resolve(productsArray);
        }
      });
    }));
  }
  getProductsBasedOnCity(vendorIdsArr: any): Promise<any> {

    if (vendorIdsArr.length > 10) {
      vendorIdsArr = vendorIdsArr.slice(0, 10)
    }
    console.log("vendorArr ", vendorIdsArr)
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('products', ref => ref.where('vendor_id', 'in', vendorIdsArr)).get().subscribe(cityBasedProducts => {
        console.log("cityBasedProducts ", cityBasedProducts.size)
        if (cityBasedProducts) {
          //   resolve(cityBasedProducts);
          // }
          const productsArray = cityBasedProducts.docs.map((product: any) => product.data());
          console.log("productsArray ", productsArray)

          resolve(productsArray);
        }
      });
    }));
  }

  getCategoryList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('categories').get().subscribe(catRes => {
        this.categoryData = [];
        if (catRes.size) {
          catRes.forEach((catItem: any) => {
            this.categoryData.push(
              {
                id: catItem.id,
                data: catItem.data()
              }
            );
          });
          resolve(this.categoryData);
        } else {
          reject(0);
        }
      })
    }));
  }

  getTagList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('tags').get().subscribe(tagRes => {
        this.tagData = [];
        if (tagRes.size) {
          tagRes.forEach((tagItem: any) => {
            this.tagData.push(
              {
                id: tagItem.id,
                data: tagItem.data()
              }
            );
          });
          resolve(this.tagData);
        } else {
          reject(0);
        }
      })
    }));
  }

  getFeatureProductList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {

      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach((shopItem: any) => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(featureProductRes => {
            this.featureProductData = [];
            if (featureProductRes.size) {
              featureProductRes.forEach((item: any) => {
                let fpData: any = item.data();
                if (fpData.inSection_id.includes('2ld91WaeDyh6qAeWR4EQ')) {
                  this.featureProductData.push(
                    {
                      id: item.id,
                      data: item.data()
                    }
                  );
                }
              });
              resolve(this.featureProductData);
            } else {
              reject(0);
            }
          });
        });
      });
    }))
  }

  getTrendingProductList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach((shopItem: any) => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(trendingProductRes => {
            this.trendingProductData = [];
            if (trendingProductRes.size) {
              trendingProductRes.forEach((item: any) => {
                let tpData: any = item.data();
                if (tpData.inSection_id.includes('aaFNfNYPHKHFHd9byUB9')) {
                  this.trendingProductData.push(
                    {
                      id: item.id,
                      data: item.data()
                    }
                  );
                }
              });
              resolve(this.trendingProductData);

            } else {
              reject(0);
            }
          });
        });
      });
    }));
  }

  getProductDetail(id: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('products', ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id)).get().subscribe(res => {
        this.productDetail = [];
        if (res) {
          this.productDetail.push(
            {
              id: res.docs[0].id,
              data: res.docs[0].data()
            }
          );
          resolve(this.productDetail);
        } else {
          reject(0);
        }
      });
    }));
  }

  getCityList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('cities').get().subscribe(citiesRes => {
        this.cityData = [];
        if (citiesRes) {
          citiesRes.forEach((cityItem: any) => {
            this.cityData.push(cityItem);
          });
          resolve(this.cityData);
        } else {
          reject(0);
        }
      });
    }));
  }

  getOccasionList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection('occasions').get().subscribe(occasionsRes => {
        this.occasionData = [];
        if (occasionsRes) {
          occasionsRes.forEach((occasionItem: any) => {
            this.occasionData.push(occasionItem);
          });
          resolve(this.occasionData);
        } else {
          reject(0);
        }
      });
    }));
  }

  getCategoryProductList(id: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach((shopItem: any) => {
          this.afs.collection('products', ref => ref.where('cat_id', '==', id).where('store_id', 'array-contains', shopItem.id)).get().subscribe(res => {
            this.catProductData = [];
            if (res.size) {
              res.forEach((catItem: any) => {
                this.catProductData.push(
                  {
                    id: catItem.id,
                    data: catItem.data()
                  }
                );
                resolve(this.catProductData);
              });

            } else {
              reject(0);
            }
          })
        });
      });
    }))
  }

  getTagProductList(id: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach((shopItem: any) => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(res => {
            this.tagProductData = [];
            let tagPData: any = [];
            if (res.size) {
              res.forEach((tagItem: any) => {
                tagPData = tagItem.data();
                if (tagPData.tag_id.includes(id)) {
                  this.tagProductData.push(
                    {
                      id: tagItem.id,
                      data: tagItem.data()
                    }
                  );
                  resolve(this.tagProductData);
                }
              });

            } else {
              reject(0);
            }
          })
        });
      });
    }))
  }

  getPriceFilterProductList(low: any, high: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.selectedCityId = localStorage.getItem('selectedCityId');
      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        shopResult.forEach((shopItem: any) => {
          this.afs.collection('products', ref => ref.where('store_id', 'array-contains', shopItem.id)).get().subscribe(res => {
            this.priceProductData = [];
            let pricePData: any = [];
            if (res.size) {
              res.forEach((priceProductItem: any) => {
                pricePData = priceProductItem.data();
                if (pricePData.price >= low && pricePData.price <= high) {
                  this.priceProductData.push(
                    {
                      id: priceProductItem.id,
                      data: priceProductItem.data()
                    }
                  );
                  resolve(this.priceProductData);
                }
              });

            } else {
              reject(0);
            }
          })
        });
      });
    }))
  }

  getFilterProductList(): Promise<any> {
    return new Promise<any>((async (resolve, reject) => {

      this.selected_cat_id = localStorage.getItem('selected_cat_id');
      this.selected_tag_id = localStorage.getItem('selected_tag_id');
      this.upper = localStorage.getItem('upper');
      this.lower = localStorage.getItem('lower');
      this.selectedCityId = localStorage.getItem('selectedCityId');

      this.afs.collection('shops', ref => ref.where('location.city_id', '==', this.selectedCityId)).get().subscribe(shopResult => {
        if (shopResult.size) {
          shopResult.forEach((shopItem: any) => {
            this.afs.collection('products', ref => ref
              .where('cat_id', '==', this.selected_cat_id)
              .where('store_id', 'array-contains', shopItem.id))
              .get().subscribe(res => {
                this.priceProductData = [];
                let pricePData: any = [];
                if (res.size) {
                  res.forEach((priceProductItem: any) => {
                    pricePData = priceProductItem.data();
                    if (this.selected_tag_id) {
                      if (pricePData.tag_id.includes(this.selected_tag_id)) {
                        if (this.lower, this.upper) {
                          if (pricePData.price >= this.lower && pricePData.price <= this.upper) {
                            this.priceProductData.push(
                              {
                                id: priceProductItem.id,
                                data: priceProductItem.data()
                              }
                            );
                          }

                        } else {
                          this.priceProductData.push(
                            {
                              id: priceProductItem.id,
                              data: priceProductItem.data()
                            }
                          );
                        }
                      }
                    } else {
                      if (this.lower, this.upper) {
                        if (pricePData.price >= this.lower && pricePData.price <= this.upper) {
                          this.priceProductData.push(
                            {
                              id: priceProductItem.id,
                              data: priceProductItem.data()
                            }
                          );
                        }

                      } else {
                        this.priceProductData.push(
                          {
                            id: priceProductItem.id,
                            data: priceProductItem.data()
                          }
                        );
                      }
                    }
                    resolve(this.priceProductData);
                  });

                } else {
                  reject(0);
                }

              });
          });
        }
      });
    }));
  }

}

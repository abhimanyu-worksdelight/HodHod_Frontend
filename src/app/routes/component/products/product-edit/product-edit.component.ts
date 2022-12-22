import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/prodcts/products.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { CategoryService } from '../../../services/category/category.service';
import { ShopsService } from '../../../services/shops/shops.service';
import { TagsService } from '../../../services/tags/tags.service';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { finalize } from 'rxjs/operators';
import convert from 'image-file-resize';
import { NgxImageCompressService } from "ngx-image-compress";
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  // ng2Select
  public vendorItems: any = [];
  public inSectionItems: any = [];
  public tagItems: any = [];
  public value: any = {};
  public disabled: boolean = false;

  valForm: UntypedFormGroup;
  selectedFile: any;
  // selectedThumnailFile: any;
  loading = false;
  Categories: any[];
  InSections: any[];
  fileName: any;
  fileUrl: any;
  // fileThumbnailName: any;
  fileThumbnailUrl: any;
  selectedSmallFile: any;
  smallFileUrl: any;
  category_id: string;
  inSection_id: string;
  productDetailData: any = [];
  id: string;
  saveLoading: boolean = false;
  imageFileloading: boolean = false;
  loginType: string;
  uid: string;
  vendorData: any = [];
  cat_id: string;
  vendor_id: string;
  fullPageLoader = false;
  pricePattern = "^[1-9]\d{0,7}(?:\.\d{1,4})?|\.\d{1,4}$";
  isQuantity: boolean = false;
  maxQuantity: any = 0;

  constructor(
    fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private validationService: ValidationService,
    private categoryService: CategoryService,
    private fireStorage: AngularFireStorage,
    private shopsService: ShopsService,
    private tagsService: TagsService,
    private vendorService: VendorsService,
    private imageCompress: NgxImageCompressService
  ) {
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'name_arabic': '',
      'cat_id': ['', Validators.required],
      'tag_id': ['', Validators.required],
      'inSection_id': '',
      'vendor_id': ['', Validators.required],
      'price': ['', Validators.required],
      'image': '',
      // 'thumbnail': '',
      'description': [''],
      'description_arabic': '',
      'isEnabled': [true, Validators.required],
      'isQuantity': [false, Validators.required],
      'max_quantity': ''
    });
  }

  imgResultBeforeCompression: string = "";
  imgResultAfterCompression: string = "";
  imgResult: string = "";

  ngOnInit(): void {
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.id = this.route.snapshot.params['id'];

    this.fullPageLoader = true;

    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.afs.collection('vendors', ref => ref.where('uid', '==', this.uid)).get().subscribe((res) => {
      res.forEach((e => {
        this.vendorData = e.data();
        this.vendor_id = e.id;
      }));
    });

    this.productsService.getProductDetail(this.id).get().subscribe((res) => {
      if (res.exists) {
        this.productDetailData = res.data();
        this.cat_id = this.productDetailData.cat_id;
        if (this.productDetailData.image) {
          this.fileName = this.productDetailData.image;
          this.fileUrl = this.productDetailData.image;
          this.selectedFile = this.fileUrl;
        }
        if (this.productDetailData.smallImage) {
          this.smallFileUrl = this.productDetailData.smallImage;
        }
        if (this.productDetailData.previewImage) {
          // this.fileThumbnailName = this.productDetailData.previewImage;
          this.fileThumbnailUrl = this.productDetailData.previewImage;
        }
        this.fullPageLoader = false;
        // console.log(this.productDetailData);
      } else {
        this.fullPageLoader = false;
      }
    });

    $('#price').bind("cut copy paste", function (e) {
      e.preventDefault();
    });

    this.categoryService.getCategoryList().subscribe(res => {
      this.Categories = res.map(e => {
        let data: Object = e.payload.doc.data();
        return {
          id: e.payload.doc.id,
          ...data
        }
      })
    });

    // this.afs.collection("homeSections").snapshotChanges().subscribe(res => {
    //   this.InSections = res.map(e => {
    //     let data: Object = e.payload.doc.data();
    //     return {
    //       id: e.payload.doc.id,
    //       ...data
    //     }
    //   })
    // });

    this.afs.collection("homeSections").snapshotChanges().subscribe(res => {
      this.inSectionItems = [];
      res.map(e => {
        let data: Object = e.payload.doc.data();
        let inSectionPostData = {
          text: data['name'],
          id: e.payload.doc.id,
        }
        this.inSectionItems.push(inSectionPostData);
      });
    });

    this.tagsService.getTagsList().subscribe(res => {
      this.tagItems = [];
      res.map(e => {
        let data: Object = e.payload.doc.data();
        let tagPostData = {
          text: data['name'],
          id: e.payload.doc.id,
        }
        this.tagItems.push(tagPostData);
        // console.log('this.tagItems', this.tagItems);
      });
    });

    // this.shopsService.getShopsList().subscribe(res => {
    //   this.vendorItems = [];
    //   res.map(e => {
    //     let data: Object = e.payload.doc.data();
    //     let vendorPostData = {
    //       text: data['name'],
    //       id: e.payload.doc.id,
    //     }
    //     this.vendorItems.push(vendorPostData);
    //   });
    //   console.log("this.vendorItems..." + this.vendorItems);
    // });
    this.vendorService.getVendorsList().subscribe(res => {
      this.vendorItems = [];
      res.map(e => {
        let data: Object = e.payload.doc.data();
        let vendorPostData = {
          text: data['name'],
          id: e.payload.doc.id,
        }
        this.vendorItems.push(vendorPostData);
      });
      console.log("this.vendorItems..." + this.vendorItems);
    });
  }

  onChangeCategory(data) {
    this.category_id = data;
    // console.log('$event', data);
  }

  // onChangeInSection(data){
  //   this.inSection_id = data;
  //   // console.log('$event', data);
  // }

  onIsQuantityChanged(value: boolean) {
    if (value == true) {
      this.isQuantity = value;
      this.maxQuantity = 1;
    } else {
      this.isQuantity = false;
      this.maxQuantity = 0;
    }
  }

  onFileChanged(event: any, type) {
    if (event && type == 'images') {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (_event) => {
        this.fileUrl = reader.result;

        // compress image start
        this.smallFileUrl = reader.result;

        this.imageCompress
          .compressFile(this.smallFileUrl, 30, 30)
          .then(
            (compressedImage) => {
              this.imgResultAfterCompression = compressedImage;
              this.smallFileUrl = compressedImage;
            }
          );
        // compress image end
      }

      // small keyboard image start
      // convert({ 
      //   file: event.target.files[0],
      //   width: 150,
      //   height: 85,
      //   // type: event.target.files[0].type.split('/')[1],
      //   type: 'jpeg'
      // }).then(resp => {
      //   this.selectedSmallFile = resp;
      //   console.log('this.selectedSmallFile', this.selectedSmallFile);

      //   if(this.selectedSmallFile === 0) return;
      //   const reader = new FileReader();
      //   reader.readAsDataURL(this.selectedSmallFile); 
      //   reader.onload = (_event) => {
      //     this.smallFileUrl = reader.result;
      //   }
      // });
      // small keyboard image end

    }

    // if(event && type == 'thumbnail'){ 
    //   this.selectedThumnailFile = event.target.files[0];

    //   if(this.selectedThumnailFile){
    //     if(this.selectedThumnailFile.size < 100000){
    //       this.fileThumbnailUrl = this.selectedThumnailFile.src;

    //       convert({ file: event.target.files[0], width: 400, height: 250, type: 'png'}).then(resp => { 
    //         this.selectedThumnailFile = resp;

    //         if(this.selectedThumnailFile.length === 0) return;
    //         const reader = new FileReader();
    //         reader.readAsDataURL(this.selectedThumnailFile); 
    //         reader.onload = (_event) => {
    //           this.fileThumbnailUrl = reader.result;
    //         }

    //       }).catch(error => {
    //         this.fileThumbnailUrl = null;
    //         console.log("error", error);
    //       });

    //     }else{
    //       alert('Image should less than 300kb!');
    //     }
    //   }
    // }
  }

  editProduct($ev, data) {
    this.loading = true;
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid && this.selectedFile) {
      const file = this.selectedFile;
      const now = Date.now();
      const basePath = '/products';
      const filePath = `${basePath}/${now}-${file.name}`;
      const fileRef = this.fireStorage.ref(filePath);
      const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
      task.snapshotChanges().pipe(finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          if (url) {
            this.fileUrl = url;
            this.loading = false;
          }
        });
      })).subscribe(url => {
        if (url) {
          this.loading = false;
        }
      });

      // small keywoard image start
      if (this.selectedSmallFile) {
        const file = this.selectedSmallFile;
        const now = Date.now();
        const basePath = '/products';
        const filePath = `${basePath}/${now}-${file.name}`;
        const fileRef = this.fireStorage.ref(filePath);
        const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
        task.snapshotChanges().pipe(finalize(() => {
          const downloadUrl = fileRef.getDownloadURL();
          downloadUrl.subscribe(url => {
            if (url) {
              this.smallFileUrl = url;
            }
          });
        })).subscribe(url => {
          if (url) {
            this.loading = false;
          }
        });
      }
      // small keywoard image end

      this.saveProductToDB(data);
    } else if (this.valForm.valid) {
      this.saveProductToDB(data);
      this.loading = false;
    }

  }

  saveProductToDB(formData) {
    this.saveLoading = true;

    // set empty array if data is blank
    let data = formData;
    if (typeof data.inSection_id == 'string' || data.inSection_id === undefined || data.inSection_id === null) data.inSection_id = [];
    if (typeof data.name_arabic === undefined || data.name_arabic === undefined || data.name_arabic === null) data.name_arabic = '';
    if (typeof data.description_arabic === undefined || data.description_arabic === undefined || data.description_arabic === null) data.description_arabic = '';

    let postData = {
      name: data.name,
      name_arabic: data.name_arabic != null ? data.name_arabic : "",
      cat_id: data.cat_id,
      tag_id: data.tag_id || [],
      inSection_id: data.inSection_id,
      vendor_id: data.vendor_id || '',
      // price: parseInt(data.price),
      price: data.price,
      max_quantity: data.max_quantity || this.maxQuantity,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      is_enabled: data.isEnabled,
      description: data.description != null ? data.description : "",
      description_arabic: data.description_arabic != null ? data.description_arabic : "",
      image: this.fileUrl || '',
      smallImage: this.smallFileUrl || '',
      previewImage: this.fileThumbnailUrl || '',
    };
    console.log('postData', postData);

    this.productsService.updateProduct(this.id, postData).then(() => {
      if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
        if (this.vendorData.categories) {
          this.vendorData.categories.forEach(vendorCategoryItem => {
            if (vendorCategoryItem['cat_id'] != postData.cat_id) {
              if (Object.keys(this.vendorData.categories).length) {
                if (vendorCategoryItem['productLimitation']) {
                  var categoriesData = {};
                  categoriesData[`categories.${this.cat_id}`] = firebase.firestore.FieldValue.increment(-1);
                  categoriesData[`categories.${postData.cat_id}`] = firebase.firestore.FieldValue.increment(1);

                  this.afs.collection("vendors").doc(this.vendor_id).update(categoriesData).then(() => {
                    this.afs.collection("settings").doc('counts').update({
                      'counts.products': firebase.firestore.FieldValue.increment(1)
                    }).then((res) => {
                      this.loading = false;
                      this.saveLoading = false;
                      this.validationService.sweetalertSuccess();
                      this.router.navigate(['/products']);
                    })
                      .catch((error) => {
                        this.loading = false;
                        this.saveLoading = false;
                      });
                  });

                } else {
                  this.saveLoading = false;
                  this.validationService.sweetalertError('Your product limitation in this category is fullfilled!');
                }

              } else {
                this.saveLoading = false;
                this.validationService.sweetalertError('Your category limitation is fullfilled!');
              }

            } else {
              this.loading = false;
              this.saveLoading = false;
              this.validationService.sweetalertSuccess();
              this.router.navigate(['/products']);
            }
          });
        }

      } else {
        this.loading = false;
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/products']);
      }

    }).catch((err) => {
      console.log(err);
      this.loading = false;
      this.saveLoading = false;
    });
  }

}

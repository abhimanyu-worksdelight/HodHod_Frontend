import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { ProductsService } from '../../../services/prodcts/products.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { CategoryService } from '../../../services/category/category.service';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { TagsService } from '../../../services/tags/tags.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { finalize } from 'rxjs/operators';
import convert from 'image-file-resize';
import { NgxImageCompressService } from "ngx-image-compress";
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  // ng2Select
  public vendorItems: any = [];
  public tagItems: any = [];
  public inSectionItems: any = [];
  public value: any = {};
  public disabled: boolean = false;

  valForm: UntypedFormGroup;
  selectedFile: any;
  // selectedThumnailFile: any;
  fileUrl: any;
  smallFileStorageUrl: any;
  selectedSmallFile: any;
  smallFileUrl: any;
  loading = false;
  Categories: any[];
  InSections: any[];
  fileThumbnailUrl: any;
  uid: string;
  category_id: string;
  inSection_id: string;
  saveLoading: boolean = false;
  loginType: string;
  vendor_id: string;
  vendorData: any = [];
  pricePattern = "^[1-9]\d{0,7}(?:\.\d{1,4})?|\.\d{1,4}$";
  isQuantity: boolean = false;
  maxQuantity: any = 0;

  constructor(
    fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private productsService: ProductsService,
    private validationService: ValidationService,
    private categoryService: CategoryService,
    private fireStorage: AngularFireStorage,
    private vendorsService: VendorsService,
    private tagsService: TagsService,
    private imageCompress: NgxImageCompressService
  ) {
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'name_arabic': '',
      'cat_id': ['', Validators.required],
      'tag_id': ['', Validators.required],
      'inSection_id': ['', Validators.required],
      'vendor_id': ['', Validators.required],
      'price': ['', Validators.required],
      'image': '',
      // 'thumbnail': '',
      'description': '',
      'description_arabic': '',
      'isEnabled': [true, Validators.required],
      'isQuantity': [false, Validators.required],
      'max_quantity': '',

    });
  }

  imgResultBeforeCompression: string = "";
  imgResultAfterCompression: string = "";
  imgResult: string = "";

  ngOnInit(): void {
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);

    this.loginType = sessionStorage.getItem('loginType');
    // console.log("this.loginType", this.loginType);

    this.afs.collection('vendors', ref => ref.where('uid', '==', this.uid)).get().subscribe((res) => {
      res.forEach((e => {
        this.vendorData = e.data();
        this.vendor_id = e.id;
      }));
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

    $('#price').bind("cut copy paste", function (e) {
      e.preventDefault();
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

    if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {

      this.afs.collection("vendors", ref => ref.where("deleted_at", '==', null).where("uid", "==", this.uid)).snapshotChanges().subscribe(res => {
        res.map(e => {
          const vendorId = e.payload.doc.id;

          this.afs.collection("shops", ref => ref.where("deleted_at", '==', null).where("vendor_id", "==", vendorId)).snapshotChanges().subscribe(res => {
            this.vendorItems = [];
            res.map(e => {
              let data: Object = e.payload.doc.data();
              let vendorPostData = {
                text: data['name'],
                id: e.payload.doc.id,
              }
              this.vendorItems.push(vendorPostData);
            });
          });
        });
      });

    } else {
      this.vendorsService.getVendorsList().subscribe(res => {
        this.vendorItems = [];
        res.map(e => {
          let data: Object = e.payload.doc.data();
          let vendorPostData = {
            text: data['name'],
            id: e.payload.doc.id,
          }
          this.vendorItems.push(vendorPostData);
        });
      });
    }
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
        this.uploadSmallFileToStorage(this.smallFileUrl);
        this.imageCompress
          .compressFile(this.smallFileUrl, 30, 30)
          .then(
            (compressedImage) => {
              this.imgResultAfterCompression = compressedImage;
              this.smallFileUrl = compressedImage;
              this.fileThumbnailUrl = compressedImage;
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
  uploadSmallFileToStorage(smallFileUrlString: String) {
    this.loading = true;
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
          this.smallFileStorageUrl = url;
          this.fileThumbnailUrl = url;
          console.log("this.smallFileStorageUrl..." + this.smallFileStorageUrl);

          // // small keywoard image start
          // if (this.selectedSmallFile) {
          //   const file = this.selectedSmallFile;
          //   const now = Date.now();
          //   const basePath = '/products';
          //   const filePath = `${basePath}/${now}-${file.name}`;
          //   const fileRef = this.fireStorage.ref(filePath);
          //   const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
          //   task.snapshotChanges().pipe(finalize(() => {
          //     const downloadUrl = fileRef.getDownloadURL();
          //     downloadUrl.subscribe(url => {
          //       if (url) {
          //         this.smallFileUrl = url;
          //         this.saveProductToDB(data);
          //       }
          //     });
          //   })).subscribe(url => {
          //     if (url) {
          //       this.loading = false;
          //     }
          //   });
          // } 


        }
      });
    })).subscribe(url => {
      if (url) {
        this.loading = false;
      }
    });
  }

  addProduct($ev, data) {

    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      // console.log("this.valForm", this.valForm);

      if (this.selectedFile) {
        this.loading = true;
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
                      this.saveProductToDB(data);
                    }
                  });
                })).subscribe(url => {
                  if (url) {
                    this.loading = false;
                  }
                });
              } else {
                this.saveProductToDB(data);
              }
              // small keywoard image end


            }
          });
        })).subscribe(url => {
          if (url) {
            this.loading = false;
          }
        });
      } else {
        // console.log("this.valForm", this.valForm);
        this.saveProductToDB(data);
      }

    }
  }

  saveProductToDB(formData) {
    this.saveLoading = true;

    // set empty array if data is blank
    let data = formData;
    // let inSection_id;
    // if(data.inSection_id && typeof data.inSection_id == 'string' || data.inSection_id === undefined || data.inSection_id === null){
    //   inSection_id = [];
    // }else{
    //   inSection_id = []
    // }
    if (typeof data.name_arabic === undefined || data.name_arabic === undefined || data.name_arabic === null) data.name_arabic = '';
    if (typeof data.description_arabic === undefined || data.description_arabic === undefined || data.description_arabic === null) data.description_arabic = '';

    let postData = {
      name: data.name,
      name_arabic: data.name_arabic,
      cat_id: data.cat_id,
      tag_id: data.tag_id || [],
      inSection_id: [data.inSection_id] || [],
      vendor_id: data.vendor_id || '',
      // price: parseInt(data.price),
      price: data.price,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      created_by: this.uid,
      is_enabled: data.isEnabled,
      is_quantity: data.isQuantity,
      max_quantity: data.max_quantity || this.maxQuantity,
      description: data.description != null ? data.description : "",
      description_arabic: data.description_arabic != null ? data.description_arabic : "",
      image: this.fileUrl || '',
      // smallImage: this.smallFileUrl || '',
      // previewImage: this.fileThumbnailUrl || '',
      smallImage: this.smallFileStorageUrl || '',
      previewImage: this.fileThumbnailUrl || '',

      deleted_at: null,
      deleted_by: null,
      disabled: false,
      deleted_by_user_type: null
    };
    console.log('postData', postData);

    this.productsService.addProdct(postData).then(() => {
      if (this.loginType == 'u7GeGmO2luLmkOMKeZ0k') {
        if (this.vendorData.categories) {
          this.vendorData.categories.forEach(vendorCategoryItem => {
            if (vendorCategoryItem['cat_id'] != postData.cat_id) {
              if (Object.keys(this.vendorData.categories).length) {
                if (vendorCategoryItem['productLimitation']) {
                  var categoriesData = {};
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
              var categoriesData = {};
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
            }
          });
        }
      } else {
        this.afs.collection("settings").doc('counts').update({
          'counts.products': firebase.firestore.FieldValue.increment(1)
        }).then((res) => {
          this.loading = false;
          this.saveLoading = false;
          this.validationService.sweetalertSuccess();
          this.router.navigate(['/products']);
        })
          . catch((error) => {
            this.loading = false;
            this.saveLoading = false;
          });
      }

    }).catch((err) => {
      console.log(err);
      this.loading = false;
      this.saveLoading = false;
    });
  }
}

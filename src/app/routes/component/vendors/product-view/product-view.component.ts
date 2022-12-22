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
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  
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

}

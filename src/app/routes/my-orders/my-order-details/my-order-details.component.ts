import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/prodcts/products.service';

@Component({
  selector: 'app-my-order-details',
  templateUrl: './my-order-details.component.html',
  styleUrls: ['./my-order-details.component.scss']
})
export class MyOrderDetailsComponent implements OnInit {
  loading = false;
  fullPageLoader = false;
  productDetailData: any = [];
  fileName: any;
  fileUrl: any;
  selectedFile: any;
  smallFileUrl: any;
  fileThumbnailUrl: any;
  id: any;
  valForm: UntypedFormGroup;

  constructor(
    private productsService: ProductsService,
    fb: UntypedFormBuilder,

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

  ngOnInit(): void {
    this.productsService.getProductDetail(this.id).get().subscribe((res) => {
      if (res.exists) {
        this.productDetailData = res.data();
        // this.cat_id = this.productDetailData.cat_id;
        if (this.productDetailData.image) {
          this.fileName = this.productDetailData.image;
          this.fileUrl = this.productDetailData.image;
          this.selectedFile = this.fileUrl;
        }
        if (this.productDetailData.smallImage) {
          this.smallFileUrl = this.productDetailData.smallImage;
        }
        if (this.productDetailData.previewImage) {
          this.fileThumbnailUrl = this.productDetailData.previewImage;
        }
        this.fullPageLoader = false;
      } else {
        this.fullPageLoader = false;
      }
    });
  }


}

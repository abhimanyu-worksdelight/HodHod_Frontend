import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../services/validation/validation.service';
import { FiltersService } from 'src/app/routes/services/system/filters/filters.service';
import firebase from 'firebase/app';
import { CategoryService } from '../../../services/category/category.service';
import { TagsService } from '../../../services/tags/tags.service';
import {ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  // ng2Select
  public categoryItems: any = [];
  public tagsItems: any = [];
  public positionItems: any = [1, 2, 3, 4];
  public value: any = {};
  public disabled: boolean = false;
  public filter_values: any = [];
  public filter_tags: any = [];
  valForm: UntypedFormGroup;

  filterActive = 1;
  Setting: any = [];

  constructor(
    fb: UntypedFormBuilder,
    public router: Router,
    private filtersService: FiltersService,
    private validationService: ValidationService,
    private categoryService: CategoryService,
    private tagsService: TagsService,
    private cdref: ChangeDetectorRef
  ) { 
    this.valForm = fb.group({
      'max': [null, Validators.required],
      'min': [null, Validators.required],
      'priceName': [null, Validators.required],
      'priceType': [null, Validators.required],
      'pricePosition': [null, Validators.required],

      'giftName': [null, Validators.required],
      'giftType': [null, Validators.required],
      'isActive': [false, Validators.required],
      'values': [false, Validators.required],
      'giftPosition': [false, Validators.required],

      'tagName': [null, Validators.required],
      'tagType': [null, Validators.required],
      'isActiveTag': [false, Validators.required],
      'tags': [false, Validators.required],
      'tagPosition': [false, Validators.required],
    });
  }

  ngOnInit(): void {
    // get setting detail data
    this.getDetailData();

    this.categoryService.getCategoryList().subscribe((res) => {
      res.map((e) => {
        // let data = e.payload.doc.data()

        const categoryData = {
          id: e.payload.doc.id, 
          text: e.payload.doc.data()['name']
        }
        this.categoryItems.push(categoryData);
      });
      // console.log("categoryItems", this.categoryItems);
    });

    this.tagsService.getTagsList().subscribe((res) => {
      res.map((e) => {
        // let data = e.payload.doc.data()

        const tagData = {
          id: e.payload.doc.id, 
          text: e.payload.doc.data()['name']
        }
        this.tagsItems.push(tagData);
      });
      // console.log("tagsItems", this.tagsItems);
    });
  }

  getDetailData(){
    this.filtersService.getSettingDetail("filters").get().subscribe((doc) => {
      if (doc.exists) {
        this.Setting = doc.data()['filters'];
        // console.log("Setting data", this.Setting);

        if(this.Setting[1].filter_values){
          this.Setting[1].filter_values.forEach(item => {
            this.filter_values.push(item.value);
          });
        }else{
          this.filter_values = [];
        }
        // console.log("this.filter_values", this.filter_values);

        if(this.Setting[2].filter_values){
          this.Setting[2].filter_values.forEach(item => {
            this.filter_tags.push(item.value);
          });
        }else{
          this.filter_tags = [];
        }
        // console.log("this.filter_tags", this.filter_tags);

      } else {
        console.log("No such document!");
      }
      },(error=>{
        console.log("error",error);
    }));
  }

  // -----------edit settings start------------
  updateSettingData($ev, data){
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      let filters = [];
      
      data.values = data.values?.map(item => {
        const {text} = this.categoryItems.find(i => i.id === item)
        return {
          name: text,
          value: item
        }
      });

      data.tags = data.tags?.map(item => {
        const {text} = this.tagsItems.find(i => i.id === item)
        return {
          name: text,
          value: item
        }
      });
      
      filters = [
        {
          max: data.max,
          min: data.min,
          name: data.priceName,
          type: data.priceType,
          position: data.pricePosition
        },
        {
          name: data.giftName,
          type: data.giftType,
          isActive: data.isActive,
          filter_values: data.values,
          position: data.giftPosition
        },
        {
          name: data.tagName,
          type: data.tagType,
          isActive: data.isActiveTag,
          filter_values: data.tags,
          position: data.tagPosition
        }
      ]

      let postData = {
        filters,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("data", postData);

      this.filtersService.updateSetting('filters', postData).then(() => {
        this.validationService.sweetalertSuccess();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  // -----------edit settings end------------  
 
}

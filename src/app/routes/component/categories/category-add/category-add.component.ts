import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { CategoryService } from '../../../services/category/category.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { ColorEvent } from 'ngx-color';
@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {

  valForm: UntypedFormGroup
  selectedFile: any
  color: String = '#000'
  loading = false;
  fileUrl: any;
  fileName: any;
  uid: string;

  constructor(
    fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private categoryService: CategoryService,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage
  ) {
    this.valForm = fb.group({
      'name': [null, Validators.required],
      'name_arabic': '',
      'color': ['#000', Validators.required],
      'file': [null, Validators.required],
      'isEnabled': [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.uid = sessionStorage.getItem('uid');
    // console.log("this.uid", this.uid);
  }

  handleColorChange($event: ColorEvent) {
    const { hex } = $event.color
    this.color = hex
  }

  onFileChanged(event: any) {
    if (event) {
      this.selectedFile = event.target.files[0];
      this.fileUrl = this.selectedFile.src;
      
      if (this.selectedFile.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); 
      reader.onload = (_event) => { 
        this.fileUrl = reader.result; 
      }
    }
  }

  addCategoryData($ev, data) {
    $ev.preventDefault();

    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.loading = true;
      const file = this.selectedFile;
      const now = Date.now();
      const basePath = '/categories';
      const filePath = `${basePath}/${now}-${file.name}`;
      const fileRef = this.fireStorage.ref(filePath);
      const task = this.fireStorage.upload(`${basePath}/${now}-${file.name}`, file);
      task.snapshotChanges().pipe(finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          if (url) {
            console.log('url', url)
            this.submitData(data, url)
          }
        });
      })).subscribe(url => {
        if (url) {
          // console.log('No images selected', url);
          this.loading = false;
        }
      });
    }
  }

  /**
   * 
   * @param data - Object
   * @param image - String
   * @returns 
   */

  submitData = (data, image) => {
    let postData = {
      name: data.name,
      name_arabic: data.name_arabic,
      is_enabled: data.isEnabled,
      color: this.color,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      created_by: this.uid,
      image
    };

    this.categoryService.addCategory(postData).then(() => {

      this.afs.collection("settings").doc('counts').update({
        'counts.categories': firebase.firestore.FieldValue.increment(1)
      }).then((res) => {
        this.loading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['categories']);
      })
        .catch((error) => {
          this.loading = false;
        });

    }).catch((err) => {
      console.log(err);
      this.loading = false;
    });
  }

}

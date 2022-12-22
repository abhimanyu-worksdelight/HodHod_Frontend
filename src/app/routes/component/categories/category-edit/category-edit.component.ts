import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from "@angular/router";
import { finalize } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  valForm: UntypedFormGroup;
  selectedFile: any
  color: String = '#000'
  id: any;
  Category: any;
  loading = false;
  fileUrl: any;
  fileName: any;

  constructor(
    fb: UntypedFormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) { 
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'name_arabic': '',
      'color': ['#000', Validators.required],
      'file': [null],
      'isEnabled': [true, Validators.required]
    });
  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];

    this.categoryService.getCategoryDetail(this.id).get().subscribe((doc) => {
      if (doc.exists) {
        this.Category = doc.data();
        const {color} = this.Category;
        this.fileName = this.Category.image;
        this.color = color;

        this.fileUrl = this.Category.image;

      } else {
        console.log("No such document!");
      }
      },(error=>{
        console.log("error",error);
    }));
    // --------get category detail end---------
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

  /**
   * 
   * @param $event 
   */
  handleColorChange($event: ColorEvent) {
    const { hex } = $event.color
    this.color = hex
  }

  /**
   * 
   * @param $ev 
   * @param data 
   */
  updateCategoryData($ev, data){
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      if(this.selectedFile) {
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
              this.submitData(data, url)
            }
          });
        })).subscribe(url => {
          if (url) {
            this.loading = false;
          }
        });
      }else {
        this.submitData(data)
      }
    }
  }
  // -----------edit category end------------


  submitData(data, image?) {
    let postData = {
      name: data.name,
      name_arabic: data.name_arabic !=null ?data.name_arabic:"",
      is_enabled: data.isEnabled,
      color: this.color,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    };
    
    if(image) {
      postData['image'] = image
    }

    this.categoryService.updateCategory(this.id, postData).then(() => {
      this.loading = false;
      this.validationService.sweetalertUpdateSuccess();
      this.router.navigate(['categories']);
    }).catch((err) => {
      this.loading = false;
      console.log(err);
    });
  }

}

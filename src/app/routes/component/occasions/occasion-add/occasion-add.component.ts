import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { OccasionsService } from '../../../services/occasions/occasions.service';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-occasion-add',
  templateUrl: './occasion-add.component.html',
  styleUrls: ['./occasion-add.component.scss']
})
export class OccasionAddComponent implements OnInit {

  valForm: UntypedFormGroup;
  selectedFile: any;
  fileUrl: any;
  loading = false;
  saveLoading: boolean = false;

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private occasionsService: OccasionsService,
    public router: Router,
  ) { 
    this.valForm = fb.group({
      'title': ['', Validators.required],
      'gif': '',
      'isEnabled': [true, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onFileChanged(event) {
    if (event) {
      this.selectedFile = event.target.files[0];
      this.fileUrl = this.selectedFile.src;
      
      if(this.selectedFile.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); 
      reader.onload = (_event) => { 
        this.fileUrl = reader.result; 
      }

    }
  }

  addOccasions($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {

      let postData = {
        title: data.title,
        gif: this.fileUrl || '',
        is_enabled: data.isEnabled,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.occasionsService.addOccasions(postData).then(() => {
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/occasions']);
          
      }).catch((err) => {
        console.log(err);
        this.saveLoading = false;
      });

    }else{
      console.log("this.valForm", this.valForm);
    }
  }

}

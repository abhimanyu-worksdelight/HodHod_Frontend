import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { OccasionsService } from '../../../services/occasions/occasions.service';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-occasion-edit',
  templateUrl: './occasion-edit.component.html',
  styleUrls: ['./occasion-edit.component.scss']
})
export class OccasionEditComponent implements OnInit {

  valForm: UntypedFormGroup;
  selectedFile: any;
  fileUrl: any;
  loading = false;
  id: string;
  saveLoading: boolean = false;
  occasionDetailData: any = [];
  fileName: any;

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private occasionsService: OccasionsService,
    public router: Router,
    private route: ActivatedRoute,
  ) { 
    this.valForm = fb.group({
      'title': ['', Validators.required],
      'gif': '',
      'isEnabled': [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.occasionsService.getOccasionsDetail(this.id).get().subscribe((res) => {
      if(res.exists){
        this.occasionDetailData = res.data();

        if(this.occasionDetailData.gif){
          this.fileName = this.occasionDetailData.gif;
          this.fileUrl = this.occasionDetailData.gif;
        }
        // console.log(this.occasionDetailData);
      }
    });
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

  editOccasions($ev, data) {
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

      this.occasionsService.updateOccasions(this.id, postData).then(() => {
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/occasions']);
          
      }).catch((err) => {
        this.saveLoading = false;
      });

    }else{
      console.log("this.valForm", this.valForm);
    }
  }

}

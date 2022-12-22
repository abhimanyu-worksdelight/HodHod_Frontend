import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HomeSectionsService } from '../../../services/homeSections/home-sections.service';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-home-sections-add',
  templateUrl: './home-sections-add.component.html',
  styleUrls: ['./home-sections-add.component.scss']
})
export class HomeSectionsAddComponent implements OnInit {
  
  valForm: UntypedFormGroup;
  saveLoading: boolean = false;

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private homeSectionsService: HomeSectionsService,
    public router: Router,
  ) { 
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'isEnabled': [true, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  addHomeSections($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {

      let postData = {
        name: data.name,
        is_enabled: data.isEnabled,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.homeSectionsService.addHomeSections(postData).then(() => {
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/homeSections']);
          
      }).catch((err) => {
        this.saveLoading = false;
      });

    }else{
      console.log("this.valForm", this.valForm);
    }
  }

}

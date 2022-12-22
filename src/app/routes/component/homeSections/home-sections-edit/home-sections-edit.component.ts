import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HomeSectionsService } from '../../../services/homeSections/home-sections.service';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-home-sections-edit',
  templateUrl: './home-sections-edit.component.html',
  styleUrls: ['./home-sections-edit.component.scss']
})
export class HomeSectionsEditComponent implements OnInit {

  valForm: UntypedFormGroup;
  id: string;
  saveLoading: boolean = false;
  HomeSectionsData: any = [];

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private homeSectionsService: HomeSectionsService,
    public router: Router,
    private route: ActivatedRoute,
  ) { 
    this.valForm = fb.group({
      'name': ['', Validators.required],
      'isEnabled': [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.homeSectionsService.getHomeSectionsDetail(this.id).get().subscribe((res) => {
      this.HomeSectionsData = res.data();
      // console.log("this.HomeSectionsData", this.HomeSectionsData);
    });
  }

  editHomeSections($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {

      let postData = {
        name: data.name,
        is_enabled: data.isEnabled,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.homeSectionsService.updateHomeSections(this.id, postData).then(() => {
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

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../../services/validation/validation.service';
import { RolesService } from '../../../../services/system/roles/roles.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-roles-add',
  templateUrl: './roles-add.component.html',
  styleUrls: ['./roles-add.component.scss']
})
export class RolesAddComponent implements OnInit {

  valForm: UntypedFormGroup;
  saveLoading: boolean = false;

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private rolesService: RolesService,
    public router: Router,
  ) { 
    this.valForm = fb.group({
      'name': ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  addRoles($ev, data) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {

      let postData = {
        name: data.name,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.rolesService.addRoles(postData).then(() => {
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/system/roles-list']);
          
      }).catch((err) => {
        this.saveLoading = false;
      });

    }else{
      console.log("this.valForm", this.valForm);
    }
  }

}

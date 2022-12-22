import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { RolesService } from '../../../../services/system/roles/roles.service';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss']
})
export class RolesEditComponent implements OnInit {

  valForm: UntypedFormGroup;
  id: string;
  saveLoading: boolean = false;
  RolesData: any = [];

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private rolesService: RolesService,
    public router: Router,
    private route: ActivatedRoute,
  ) { 
    this.valForm = fb.group({
      'name': ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.rolesService.getRolesDetail(this.id).get().subscribe((res) => {
      this.RolesData = res.data();
      // console.log("this.RolesData", this.RolesData);
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
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // console.log("postData", postData);

      this.rolesService.updateRoles(this.id, postData).then(() => {
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

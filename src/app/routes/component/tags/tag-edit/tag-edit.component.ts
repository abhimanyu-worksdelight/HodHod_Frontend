import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TagsService } from '../../../services/tags/tags.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit {

  valForm: UntypedFormGroup;
  saveLoading: boolean = false;
  Tags: any = [];
  id: string;

  constructor(
    fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private tagsService: TagsService,
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

    this.tagsService.getTagsDetail(this.id).get().subscribe((res) => {
      if(res.exists){
        this.Tags = res.data();
      }
    });
  }

  editTags($ev, data) {
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

      this.tagsService.updateTags(this.id, postData).then(() => {
        this.saveLoading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/tags']);
          
      }).catch((err) => {
        this.saveLoading = false;
      });

    }else{
      console.log("this.valForm", this.valForm);
    }
  }

}

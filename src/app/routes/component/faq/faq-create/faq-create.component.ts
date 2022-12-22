import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { FaqService } from '../../../services/faq/faq.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';

declare var $: any;
@Component({
  selector: 'app-faq-create',
  templateUrl: './faq-create.component.html',
  styleUrls: ['./faq-create.component.scss']
})
export class FaqCreateComponent implements OnInit {

  contents: string;
  valForm: UntypedFormGroup;
  loading: Boolean = false;

  constructor(
    fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private faqService: FaqService,
    private validationService: ValidationService
  ) { 
    this.valForm = fb.group({
      'question': ['', Validators.required],
      'question_arabic': '',
      'answer': ['', Validators.required],
      'answer_arabic': '',
    });
  }

  ngOnInit(): void {
    console.log($('#summernote'))
    $('#summernote').summernote({
      height: 280,
      disableDragAndDrop: true,
      shortcuts: false,
      placeholder: 'Enter your answer here...',
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', [ 'fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['insert', ['link', 'hr']],
        ['view', ['fullscreen']],
      ],
      dialogsInBody: true,
      callbacks: {
        onChange: (contents, $editable) => {
          this.contents = contents;
          this.valForm.patchValue({
            answer: contents, 
          });
          
        }
      }
    });

    $('#summernote_arabic').summernote({
      height: 280,
      disableDragAndDrop: true,
      shortcuts: false,
      placeholder: 'Enter your answer here...',
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', [ 'fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['insert', ['link', 'hr']],
        ['view', ['fullscreen']],
      ],
      dialogsInBody: true,
      callbacks: {
        onChange: (contents, $editable) => {
          this.contents = contents;
          this.valForm.patchValue({
            answer: contents, 
          });
          
        }
      }
    });

    // Hide the initial popovers that display
    $('.note-popover').css({
      'display': 'none'
    });

  }

  /**
   * 
   * @param $ev 
   * @param data 
   */
  saveFAQData = ($ev, params) => {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    const data = {
      ...params,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }

    if (this.valForm.valid) {
      this.faqService.addFAQ(data).then(() => {
        this.loading = false;
        this.validationService.sweetalertSuccess();
        this.router.navigate(['/faq-manager']);
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
    }
  }

}

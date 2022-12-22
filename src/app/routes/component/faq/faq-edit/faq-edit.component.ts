import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { FaqService } from '../../../services/faq/faq.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';

declare var $: any;

@Component({
  selector: 'app-faq-edit',
  templateUrl: './faq-edit.component.html',
  styleUrls: ['./faq-edit.component.scss']
})
export class FaqEditComponent implements OnInit {

  valForm: UntypedFormGroup;
  id: any;
  editedFAQ: any;
  loading = false;
  contents: string;

  constructor(
    fb: UntypedFormBuilder,
    private afs: AngularFirestore,
    public router: Router,
    private faqService: FaqService,
    private validationService: ValidationService,
    private route: ActivatedRoute,
  ) { 
    this.valForm = fb.group({
      'question': ['', Validators.required],
      'question_arabic': ['', Validators.required],
      'answer': ['', Validators.required],
      'answer_arabic': ['', Validators.required],
    });
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.initializeEditor()

    this.id = this.route.snapshot.params['id'];

    this.faqService.getFaqDetail(this.id).get().subscribe((doc) => {
      if (doc.exists) {
        this.editedFAQ = doc.data();
        
        const {answer, question} = this.editedFAQ
        this.contents = answer
        $('#summernote').summernote('code', this.contents);
        this.valForm.patchValue({
          answer,
          question
        });
      } else {
        console.log("No such document!");
      }
      },(error=>{
        console.log("error",error);
    }));
  }

  /**
   * @initializeEditor
   */
  initializeEditor = () => {
    $('#summernote').summernote({
      height: 280,
      disableDragAndDrop: true,
      shortcuts: false,
      placeholder: 'Your answer here...',
      code: this.contents,
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
        onChange: (contents) => {
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
   updateFAQData = ($ev, params) => {
    $ev.preventDefault();
    
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    const data = {
      ...params,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }
    
    const answer = $('#summernote').summernote('code')
    const elementData = new DOMParser().parseFromString(answer, "text/html").documentElement.textContent;

    if(!elementData) {
      this.valForm.controls['answer'].setErrors({'required': true});
    }

    if (this.valForm.valid) {
      this.faqService.updateFAQ(this.id, data).then(() => {
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

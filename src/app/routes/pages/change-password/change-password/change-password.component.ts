import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../../core/settings/settings.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthService } from '../../../../authentication/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  valForm: UntypedFormGroup;

  constructor(
    fb: UntypedFormBuilder,
    public settings: SettingsService, 
    public authService: AuthService) {
    this.valForm = fb.group({
      'password': [null, Validators.compose([Validators.required])],
      'confirmpassword': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
  }

  onSubmitChangePassword($ev, value: any){
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      // this.authService.ForgotPassword(value.email);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthService } from '../../../authentication/auth.service'

@Component({
    selector: 'app-recover',
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

    valForm: UntypedFormGroup;

    constructor(
        public settings: SettingsService, 
        fb: UntypedFormBuilder,
        private authService: AuthService
    ) {
        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])]
        });
    }

    onSubmitForgotPassword($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            this.authService.ForgotPassword(value.email);
        }
    }

    ngOnInit() {
    }

}

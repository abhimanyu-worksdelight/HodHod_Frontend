import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { Router } from "@angular/router";
import { AuthService } from '../../../authentication/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    valForm: UntypedFormGroup;
    loginLoading: boolean = false;

    constructor(public settings: SettingsService,
        fb: UntypedFormBuilder,
        public authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {

        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
            'password': [null, Validators.required]
        });

    }

    ngOnInit() {
        if (this.authService.isLoggedIn) {
            this.router.navigate(['dashboard']);
        }
    }

    submitForm($ev, value: any) {
        this.loginLoading = true;
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            console.log("JSON.stringify(value)..." + JSON.stringify(value))
            sessionStorage.setItem('user', JSON.stringify(value));
            sessionStorage.getItem('uid');
            sessionStorage.getItem('user');
            this.loginLoading = false;
        } else {
            this.loginLoading = false;
        }
    }

}

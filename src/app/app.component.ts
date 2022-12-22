import { Component, HostBinding, OnInit } from '@angular/core';
import { SettingsService } from './core/settings/settings.service';
import { AuthService } from './authentication/auth.service';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    loginType: any;
    uid: any;

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.getLayoutSetting('isFixed'); };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.getLayoutSetting('isCollapsed'); };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.getLayoutSetting('isBoxed'); };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.getLayoutSetting('useFullLayout'); };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.getLayoutSetting('hiddenFooter'); };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.getLayoutSetting('horizontal'); };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.getLayoutSetting('isFloat'); };
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.getLayoutSetting('offsidebarOpen'); };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.getLayoutSetting('asideToggled'); };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.getLayoutSetting('isCollapsedText'); };

    constructor(
        public settings: SettingsService,
        private authService: AuthService,
        private Location:Location,
        public router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        // prevent empty links to reload the page
        document.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && ['', '#'].indexOf(target.getAttribute('href')) > -1)
                e.preventDefault();
        });

        this.loginType = sessionStorage.getItem('loginType');
        // console.log("this.loginType", this.loginType);

        this.uid = sessionStorage.getItem('uid');
        // console.log("this.uid", this.uid);

        if(this.loginType == null && this.uid == null && window.location.href.split("/").pop() == 'login'){
            this.authService.SignOut();
        }
    }

    ngAfterViewInit() {
        // prevent empty links to reload the page
        document.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && ['', '#'].indexOf(target.getAttribute('href')) > -1)
                e.preventDefault();
        });

        this.loginType = sessionStorage.getItem('loginType');
        // console.log("this.loginType", this.loginType);

        this.uid = sessionStorage.getItem('uid');
        // console.log("this.uid", this.uid);

        if(this.loginType == null && this.uid == null && window.location.href.split("/").pop() == 'login'){
            this.authService.SignOut();
        }
    }
}

import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
const screenfull = require('screenfull');

import { AuthService } from '../../authentication/auth.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout
    router: Router;

    @ViewChild('fsbutton', { static: true }) fsbutton;  // the fullscreen button

    constructor(public menu: MenuService, 
        public settings: SettingsService, 
        public injector: Injector,
        public authService: AuthService
        ) {

        // show only a few items on demo
        // this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout

    }

    ngOnInit() {

        // var ua = window.navigator.userAgent;
        // if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) { // Not supported under IE
        //     this.fsbutton.nativeElement.style.display = 'none';
        // }

        // Switch fullscreen icon indicator
        // const el = this.fsbutton.nativeElement.firstElementChild;
        // screenfull.on('change', () => {
        //     if (el)
        //         el.className = screenfull.isFullscreen ? 'fa fa-compress' : 'fa fa-expand';
        // });

        this.router = this.injector.get(Router);

        // Autoclose navbar on mobile when route change
        this.router.events.subscribe((val) => {
            // scroll view to top
            window.scrollTo(0, 0);
            // close collapse menu
            this.navCollapsed = true;
        });

    }

    toggleUserBlock(event) {
        event.preventDefault();
    }

    toggleOffsidebar() {
        this.settings.toggleLayoutSetting('offsidebarOpen');
    }

    toggleCollapsedSideabar() {
        this.settings.toggleLayoutSetting('isCollapsed');
    }

    isCollapsedText() {
        return this.settings.getLayoutSetting('isCollapsedText');
    }

    toggleFullScreen(event) {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }
}

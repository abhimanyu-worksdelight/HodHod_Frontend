/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterModule, Router } from '@angular/router';

import { MenuService } from '../../core/menu/menu.service';
import { SettingsService } from '../../core/settings/settings.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

describe('Component: Sidebar', () => {
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MenuService,
                SettingsService,
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
    });

    it('should create an instance', async(inject([MenuService, SettingsService, Router, AuthService, AngularFirestore], (menuService, settingsService, router, authService, afs) => {
        let component = new SidebarComponent(menuService, settingsService, router, authService, afs);
        expect(component).toBeTruthy();
    })));
});

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
import { FaqComponent } from './faq/faq.component';

/* Use this routes definition in case you want to make them lazy-loaded */
/*const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },
];*/

@NgModule({
    imports: [
        SharedModule,
        // RouterModule.forChild(routes)
    ],
    declarations: [
        LoginComponent,
        RecoverComponent,
        MaintenanceComponent,
        Error404Component,
        Error500Component,
        ChangePasswordComponent,
        FaqComponent,
    ],
    exports: [
        RouterModule,
        LoginComponent,
        RecoverComponent,
        MaintenanceComponent,
        Error404Component,
        Error500Component
    ]
})
export class PagesModule { }

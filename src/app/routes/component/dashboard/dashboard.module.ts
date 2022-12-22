import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { VendorGuard } from '../../../guard/dashboard/vendor.guard';
import { AuthGuard } from '../../../guard/auth.guard';
import { SuperadminGuard } from '../../../guard/dashboard/superadmin.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardVendorComponent } from './dashboard-vendor/dashboard-vendor.component';

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard, SuperadminGuard] },
    { path: 'dashboard-vendor', component: DashboardVendorComponent, canActivate: [AuthGuard, VendorGuard] }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        DashboardComponent,
        DashboardVendorComponent
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardModule { }
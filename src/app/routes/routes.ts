import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { FaqComponent } from './pages/faq/faq.component';
import { SeeGiftComponent } from './component/see-gift/see-gift.component';
import { GotGiftComponent } from './component/got-gift/got-gift.component';

import { AuthGuard } from '../guard/auth.guard';
import { ChangePasswordComponent } from './pages/change-password/change-password/change-password.component';

export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    {
        path: '',
        component: LayoutComponent,
        children: [
            // user route here
            { path: 'users', loadChildren: () => import('./component/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard] },

            // dashboard route here
            { path: 'dashboard', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },

            { path: 'categories', loadChildren: () => import('./component/categories/categories.module').then(m => m.CategoriesModule), canActivate: [AuthGuard] },

            { path: 'shops', loadChildren: () => import('./component/shops/shops.module').then(m => m.ShopsModule), canActivate: [AuthGuard] },

            { path: 'products', loadChildren: () => import('./component/products/products.module').then(m => m.ProductsModule), canActivate: [AuthGuard] },

            { path: 'orders', loadChildren: () => import('./component/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuard] },


            { path: 'vendors', loadChildren: () => import('./component/vendors/vendors.module').then(m => m.VendorsModule), canActivate: [AuthGuard] },

            { path: 'roles', loadChildren: () => import('./component/user-roles/user-roles.module').then(m => m.UserRolesModule), canActivate: [AuthGuard] },

            { path: 'cities', loadChildren: () => import('./component/cities/cities.module').then(m => m.CitiesModule), canActivate: [AuthGuard] },

            { path: 'myOrders', loadChildren: () => import('./my-orders/my-orders.module').then(m => m.MyOrdersModule), canActivate: [AuthGuard] },

            { path: 'faq-manager', loadChildren: () => import('./component/faq/faq.module').then(m => m.FaqModule), canActivate: [AuthGuard] },

            { path: 'homeSections', loadChildren: () => import('./component/homeSections/homeSections.module').then(m => m.HomeSectionsModule), canActivate: [AuthGuard] },

            { path: 'occasions', loadChildren: () => import('./component/occasions/occasions.module').then(m => m.OccasionsModule), canActivate: [AuthGuard] },

            { path: 'tags', loadChildren: () => import('./component/tags/tags.module').then(m => m.TagsModule), canActivate: [AuthGuard] },

            { path: 'system', loadChildren: () => import('./component/system/system.module').then(m => m.SystemModule), canActivate: [AuthGuard] },

        ]
    },

    // see got & see gift route here
    { path: 'got-gift', component: GotGiftComponent },
    { path: 'claim-gift/:id', component: SeeGiftComponent },

    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },
    { path: 'faq', component: FaqComponent },

    // Not found
    { path: '**', redirectTo: 'error404' }

];
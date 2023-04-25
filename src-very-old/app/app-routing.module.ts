import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbaordComponent } from './pages/dashbaord/dashbaord.component';
import { ProductlistingComponent } from './pages/productlisting/productlisting.component';
import { ProductdetailComponent } from './pages/productdetail/productdetail.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AuthGuard } from './guard/auth.guard';
import { GiftDetailComponent } from './pages/gift-detail/gift-detail.component';
import { MyGiftsComponent } from './pages/my-gifts/my-gifts.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  { path: '', component: DashbaordComponent },
  { path: 'home', component: DashbaordComponent },
  { path: 'product-list/:id', component: ProductlistingComponent, canActivate: [AuthGuard] },
  { path: 'product-detail/:id/:quantity', component: ProductdetailComponent, canActivate: [AuthGuard] },
  { path: 'checkout/:id/:quantity', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'mygifts', component: MyGiftsComponent, canActivate: [AuthGuard] },
  { path: 'gift-detail', component: GiftDetailComponent, canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

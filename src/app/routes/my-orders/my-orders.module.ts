import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersListingComponent } from './my-orders-listing/my-orders-listing.component';
import { MyOrderDetailsComponent } from './my-order-details/my-order-details.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  { path: '', component: MyOrdersListingComponent },
  { path: 'list', component: MyOrdersListingComponent },
  { path: 'add', component: MyOrderDetailsComponent },

];

@NgModule({
  declarations: [
    MyOrdersListingComponent,
    MyOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UiSwitchModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)

  ]
})
export class MyOrdersModule { }

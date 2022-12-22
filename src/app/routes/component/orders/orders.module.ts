import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrderListComponent } from '../orders/order-list/order-list.component';

const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'orders', component: OrderListComponent },
]

@NgModule({
  declarations: [OrderListComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrdersModule { }

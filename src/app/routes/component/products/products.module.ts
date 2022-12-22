import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductAddComponent } from './product-add/product-add.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSelectModule } from 'ngx-select-ex';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { NgxImageCompressService } from "ngx-image-compress";

const routes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'add', component: ProductAddComponent },
  { path: 'edit/:id', component: ProductEditComponent },
];

@NgModule({
  declarations: [
    ProductsListComponent,
    ProductAddComponent,
    ProductEditComponent,
  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    NgxSelectModule,
    CommonModule,
    UiSwitchModule,
    RouterModule.forChild(routes)
  ],
  providers: [NgxImageCompressService],
  exports: [
    RouterModule
  ]
})
export class ProductsModule { }

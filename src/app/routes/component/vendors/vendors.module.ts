import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { VendorsAddComponent } from './vendors-add/vendors-add.component';
import { VendorsEditComponent } from './vendors-edit/vendors-edit.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSelectModule } from 'ngx-select-ex';
import { VendorsViewComponent } from './vendors-view/vendors-view.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
  { path: '', component: VendorsListComponent },
  { path: 'shops', component: VendorsListComponent },
  { path: 'add', component: VendorsAddComponent },
  { path: 'edit/:id', component: VendorsEditComponent },
  { path: 'view/:id', component: VendorsViewComponent },
  { path: 'storeDetail/:id', component: StoreViewComponent },
  { path: 'productDetail/:id', component: ProductViewComponent },
];

@NgModule({
  declarations: [
    VendorsListComponent,
    VendorsAddComponent,
    VendorsEditComponent,
    VendorsViewComponent,
    StoreViewComponent,
    ProductViewComponent

  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    NgxSelectModule,
    CommonModule,
    UiSwitchModule,
    NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw',
      apiKey: 'AIzaSyAcV7LUFFMiU_cUcsp03MuxJgMEDRcVb5A',
    }),
    RouterModule.forChild(routes)
  ]
})
export class VendorsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ShopsListComponent } from './shops-list/shops-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ShopAddComponent } from './shop-add/shop-add.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AgmCoreModule } from '@agm/core';
import { ShopEditComponent } from './shop-edit/shop-edit.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ShopsViewComponent } from './shops-view/shops-view.component';

const routes: Routes = [
  { path: '', component: ShopsListComponent },
  { path: 'shops', component: ShopsListComponent },
  { path: 'add', component: ShopAddComponent },
  { path: 'edit/:id', component: ShopEditComponent },
  { path: 'view/:id', component: ShopsViewComponent },
];
@NgModule({
  declarations: [
    ShopsListComponent,
    ShopAddComponent,
    ShopEditComponent,
    ShopsViewComponent
  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    CommonModule,
    UiSwitchModule,
    NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw',
      apiKey: 'AIzaSyAcV7LUFFMiU_cUcsp03MuxJgMEDRcVb5A',
    }),
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ShopsModule { }
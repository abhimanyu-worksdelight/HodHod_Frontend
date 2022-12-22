import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CityListComponent } from './city-list/city-list.component';
import { CityAddComponent } from './city-add/city-add.component';
import { CityEditComponent } from './city-edit/city-edit.component';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes: Routes = [
  { path: '', component: CityListComponent },
  { path: 'list', component: CityListComponent },
  { path: 'add', component: CityAddComponent },
  { path: 'edit/:id', component: CityEditComponent },
];

@NgModule({
  declarations: [CityListComponent, CityAddComponent, CityEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    UiSwitchModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CitiesModule { }

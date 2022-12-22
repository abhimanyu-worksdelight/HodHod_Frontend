import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { HomeSectionsListComponent } from './home-sections-list/home-sections-list.component';
import { HomeSectionsAddComponent } from './home-sections-add/home-sections-add.component';
import { HomeSectionsEditComponent } from './home-sections-edit/home-sections-edit.component';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes: Routes = [
  { path: '', component: HomeSectionsListComponent },
  { path: 'list', component: HomeSectionsListComponent },
  { path: 'add', component: HomeSectionsAddComponent },
  { path: 'edit/:id', component: HomeSectionsEditComponent },
]

@NgModule({
  declarations: [
    HomeSectionsListComponent,
    HomeSectionsAddComponent,
    HomeSectionsEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgxDatatableModule,
    UiSwitchModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeSectionsModule { }

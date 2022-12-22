import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OccasionEditComponent } from './occasion-edit/occasion-edit.component';
import { OccasionListComponent } from './occasion-list/occasion-list.component';
import { OccasionAddComponent } from './occasion-add/occasion-add.component';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes: Routes = [
  { path: '', component: OccasionListComponent },
  { path: 'list', component: OccasionListComponent },
  { path: 'add', component: OccasionAddComponent },
  { path: 'edit/:id', component: OccasionEditComponent },
];

@NgModule({
  declarations: [
    OccasionEditComponent,
    OccasionListComponent,
    OccasionAddComponent
  ],
  imports: [
    CommonModule,
    UiSwitchModule,
    SharedModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class OccasionsModule { }

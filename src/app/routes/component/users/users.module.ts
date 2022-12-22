import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AddUserComponent } from './add-users/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UsersListingComponent } from './user-listing/user-listing.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSelectModule } from 'ngx-select-ex';

const routes: Routes = [
  { path: '', component: UsersListingComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'user-listing', component: UsersListingComponent },
];

@NgModule({
  declarations: [
    AddUserComponent,
    EditUserComponent,
    UsersListingComponent,

  ],
  imports: [
    NgxDatatableModule,
    CommonModule,
    SharedModule,
    UiSwitchModule,
    NgxSelectModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersModule { }

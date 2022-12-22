import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRolesAddComponent } from './user-roles-add/user-roles-add.component';
import { UserRolesEditComponent } from './user-roles-edit/user-roles-edit.component';
import { UserRolesComponent } from './user_roles/user-roles.component';
import { NgxSelectModule } from 'ngx-select-ex';

const routes: Routes = [
  { path: '', component: UserRolesComponent },
  { path: 'roles', component: UserRolesComponent },
  { path: 'add-roles', component: UserRolesAddComponent },
  { path: 'edit-role/:id', component: UserRolesEditComponent },
];

@NgModule({
  declarations: [
    UserRolesComponent,
    UserRolesAddComponent,
    UserRolesEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    UiSwitchModule,
    NgxSelectModule
,
    RouterModule.forChild(routes)
  ]
})
export class UserRolesModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesModule } from 'angular-datatables';
import { TreeModule } from '@circlon/angular-tree-component';
import { CKEditorModule } from 'ckeditor4-angular';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';
import { GeneralComponent } from './general-settings/general/general.component';
import { FiltersComponent } from './filters/filters.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSelectModule } from 'ngx-select-ex';
import { RolesAddComponent } from './roles/roles-add/roles-add.component';
import { RolesEditComponent } from './roles/roles-edit/roles-edit.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';

const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  { path: 'recycle-bin', component: RecycleBinComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'roles-list', component: RolesListComponent },
  { path: 'roles-add', component: RolesAddComponent },
  { path: 'roles-edit/:id', component: RolesEditComponent },
];

@NgModule({
  imports: [
    NgxDatatableModule,
    DataTablesModule,
    TreeModule,
    SharedModule,
    CKEditorModule,
    RouterModule.forChild(routes),
    CommonModule,
    UiSwitchModule,
    NgxSelectModule
  ],
  declarations: [
    GeneralComponent,
    RecycleBinComponent,
    FiltersComponent,
    RolesAddComponent,
    RolesEditComponent,
    RolesListComponent,
  ],
  exports: [
    RouterModule
  ]
})
export class SystemModule { }

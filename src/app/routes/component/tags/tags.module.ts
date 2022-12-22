import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagAddComponent } from './tag-add/tag-add.component';

const routes: Routes = [
  { path: '', component: TagListComponent },
  { path: 'tags', component: TagListComponent },
  { path: 'add', component: TagAddComponent },
  { path: 'edit/:id', component: TagEditComponent },
];

@NgModule({
  declarations: [
    TagAddComponent, 
    TagEditComponent, 
    TagListComponent
  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    CommonModule,
    UiSwitchModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TagsModule { }

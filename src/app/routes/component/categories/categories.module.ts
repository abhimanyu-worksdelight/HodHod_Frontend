import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ColorChromeModule } from 'ngx-color/chrome';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes: Routes = [
  { path: '', component: CategoriesListComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'add', component: CategoryAddComponent },
  { path: 'edit/:id', component: CategoryEditComponent },
];

@NgModule({
  declarations: [
    CategoriesListComponent,
    CategoryAddComponent,
    CategoryEditComponent
  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    CommonModule,
    ColorChromeModule,
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
export class CategoriesModule { }

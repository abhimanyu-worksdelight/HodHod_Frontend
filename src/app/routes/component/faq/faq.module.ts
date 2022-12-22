import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqCreateComponent } from './faq-create/faq-create.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { FaqComponent } from './faq/faq.component';
import { FaqEditComponent } from './faq-edit/faq-edit.component';

const routes: Routes = [
  { path: '', component: FaqListComponent },
  { path: 'list', component: FaqListComponent },
  { path: 'add', component: FaqCreateComponent },
  { path: 'edit/:id', component: FaqEditComponent },
];

@NgModule({
  declarations: [
    FaqListComponent,
    FaqCreateComponent,
    // FaqComponent,
    FaqEditComponent
  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FaqModule { }

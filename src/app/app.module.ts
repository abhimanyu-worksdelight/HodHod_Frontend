import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from './layout/layout.module';
import { DashbaordComponent } from './pages/dashbaord/dashbaord.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ProductlistingComponent } from './pages/productlisting/productlisting.component';
import { ProductdetailComponent } from './pages/productdetail/productdetail.component';
import { WindowService } from './shared/window/window.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxShimmeringLoaderModule } from 'ngx-shimmering-loader';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  declarations: [
    AppComponent,
    DashbaordComponent,
    ProductlistingComponent,
    ProductdetailComponent,
    FaqComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    AppRoutingModule,
    SlickCarouselModule,
    NgxShimmeringLoaderModule,
    BsDropdownModule,
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,

    AgmCoreModule.forRoot({
      // please get your own API key here:
      // apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw',
      apiKey: 'AIzaSyAcV7LUFFMiU_cUcsp03MuxJgMEDRcVb5A',
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [WindowService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }

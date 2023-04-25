import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

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
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw',
      apiKey: 'AIzaSyAcV7LUFFMiU_cUcsp03MuxJgMEDRcVb5A',
    }),
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [WindowService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

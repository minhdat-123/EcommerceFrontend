import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
// Import commented out for future use
// import { OrderHistoryComponent } from './order-history/order-history.component';
import { AddProductComponent } from './add-product/add-product.component';

@NgModule({     
  declarations: [
    AppComponent,
    ProductListComponent,
    // Component commented out for future use
    // OrderHistoryComponent,
    AddProductComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { MemberGuard } from './auth/member.guard';
import { AdminGuard } from './auth/admin.guard';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataTablesModule } from 'angular-datatables';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.service';
import { routes } from './app.routes';
import { OrderHistoryComponent } from './admin/order-history/order-history.component';
import { CurrentOrdersComponent } from './admin/current-orders/current-orders.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { VansComponent } from './admin/vans/vans.component';
import { DepotsComponent } from './admin/depots/depots.component';
import { ItemsComponent } from './admin/items/items.component';
import { KitsComponent } from './admin/kits/kits.component';
import { ServicesComponent } from './admin/services/services.component';
import { TotalStocksComponent } from './admin/total-stocks/total-stocks.component';
import { VanStocksComponent } from './admin/van-stocks/van-stocks.component';
import { TechsComponent } from './admin/techs/techs.component';

import {PrintService} from './print.service';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { UserComponent } from './admin/user/user.component';
import { ForgotComponent } from './forgot/forgot.component';


// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDoBxHLot_ahv7VvSrF0j28wtcISN3UqUQ",
  authDomain: "van-restocking.firebaseapp.com",
  databaseURL: "https://van-restocking.firebaseio.com",
  projectId: "van-restocking",
  storageBucket: "van-restocking.appspot.com",
  messagingSenderId: "563550325278"
};

@NgModule({
  declarations: [
    AppComponent,
    EmailComponent, 
    SignupComponent,
    HomeComponent,
    DashboardComponent,
    OrderHistoryComponent,
    CurrentOrdersComponent,
    VansComponent,
    DepotsComponent,
    ItemsComponent,
    KitsComponent,
    ServicesComponent,
    TotalStocksComponent,
    VanStocksComponent,
    TechsComponent,
    PrintLayoutComponent,
    InvoiceComponent,
    UserComponent,
    ForgotComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTablesModule,
    NgbModule,
    routes
  ],
  providers: [AuthGuard, AngularFireDatabase, PrintService, AdminGuard, MemberGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

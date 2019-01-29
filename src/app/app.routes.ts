import { ForgotComponent } from './forgot/forgot.component';
import { MemberGuard } from './auth/member.guard';
import { UserComponent } from './admin/user/user.component';
import { AdminGuard } from './auth/admin.guard';
import { InvoiceComponent } from './invoice/invoice.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { KitsComponent } from './admin/kits/kits.component';
import { ItemsComponent } from './admin/items/items.component';
import { DepotsComponent } from './admin/depots/depots.component';
import { VansComponent } from './admin/vans/vans.component';
import { VanStocksComponent } from './admin/van-stocks/van-stocks.component';
import { CurrentOrdersComponent } from './admin/current-orders/current-orders.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { OrderHistoryComponent } from './admin/order-history/order-history.component';
import { TotalStocksComponent } from './admin/total-stocks/total-stocks.component';
import { TechsComponent } from './admin/techs/techs.component';
import { ServicesComponent } from './admin/services/services.component';

export const router: Routes = [
    { path: '', redirectTo: 'login-email', pathMatch: 'full' },
    // { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'fogot', component: ForgotComponent},
    { 
        path: 'home', 
        component: HomeComponent, 
        canActivate: [MemberGuard],

        children: [
            { path: 'current-order', component: CurrentOrdersComponent},
            { path: 'order-history', component: OrderHistoryComponent},
            { path: 'total-stock', component: TotalStocksComponent},
            { path: 'van-stock', component: VanStocksComponent},
            { path: 'tech', component: TechsComponent},
            { path: 'van', component: VansComponent},
            { path: 'depot', component: DepotsComponent},
            { path: 'item', component: ItemsComponent},
            { path: 'kit', component: KitsComponent},
            { path: 'service', component: ServicesComponent},
            { path: 'user', component: UserComponent, canActivate: [AdminGuard]},
            { path: '', redirectTo: 'current-order', pathMatch: 'full'}
        ]
    },
    { 
        path: 'print',
        outlet: 'print',
        component: PrintLayoutComponent,
        canActivate: [MemberGuard],
        children: [
            { path: 'invoice/:invoiceIds', component: InvoiceComponent }
        ]
  }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
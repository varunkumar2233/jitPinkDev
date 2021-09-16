import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CreditBalanceComponent } from './credit-balance/credit-balance.component';
import { CreditsComponent } from './credits/credits.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ProfileAccountSettingComponent } from './profile-account-setting/profile-account-setting.component';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { PurchasedReportsComponent } from './purchased-reports/purchased-reports.component';
import { ReachUsComponent } from './reach-us/reach-us.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { WelcomePinkertonComponent } from './welcome-pinkerton/welcome-pinkerton.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { GetSampleReportsComponent } from './get-sample-reports/get-sample-reports.component';
import { SampleReportCartComponent } from './sample-reports/sample-reportcart.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
const routes: Routes = [
  {
 path: '', component: WrapperComponent,
  children:[
    { path: '', component: MainpageComponent, pathMatch:'full'},
    { path: 'terms-condition', component: TermsConditionComponent },
    { path: 'cart', component: CartComponent },
    { path: 'purchaseReports', component: PurchaseReportsComponent },
    { path: 'getintouch', component: ReachUsComponent },
    { path: 'creditBalance', component: CreditBalanceComponent },
    { path: 'credits', component: CreditsComponent, },
    { path: 'profileAccountSetting', component: ProfileAccountSettingComponent },
    { path: 'purchasedReports', component: PurchasedReportsComponent},
    { path: 'orderConfirmation', component: OrderConfirmationComponent},
    { path: 'getSampleReports', component: GetSampleReportsComponent},
    { path: 'sampleReports', component: SampleReportCartComponent}

    
    

  ]
}
]


// const routes: Routes = [
//  // { path: '', component: WrapperComponent},
//   { path: '', component: WrapperComponent },
//   { path: 'terms-condition', component: TermsConditionComponent },

  

//   // otherwise redirect to home
//  // { path: '**', redirectTo: '' }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HeaderComponent } from './header/header.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { LeftNavigationComponent } from './left-navigation/left-navigation.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WrapperComponent } from './wrapper/wrapper.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';
import { MainpageComponent } from './mainpage/mainpage.component';
import { MapHomeComponent } from './map-home/map-home.component';
import { ReachUsComponent } from './reach-us/reach-us.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CrossComponent } from './cross/cross.component';
import { WelcomePinkertonComponent } from './welcome-pinkerton/welcome-pinkerton.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HttpClientModule } from '@angular/common/http';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CreditBalanceComponent } from './credit-balance/credit-balance.component';
import { CreditsComponent } from './credits/credits.component';
import { ProfileAccountSettingComponent } from './profile-account-setting/profile-account-setting.component';
import { ChangePasswordComponent } from './profile-account-setting/change-password/change-password.component';
import { InformationOverviewComponent } from './profile-account-setting/information-overview/information-overview.component';
import { CartComponent } from './cart/cart.component';
import { PurchasedReportsComponent } from './purchased-reports/purchased-reports.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { GetSampleReportsComponent } from './get-sample-reports/get-sample-reports.component';
import { SampleReportCartComponent } from './sample-reports/sample-reportcart.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
     HeaderComponent,
     WrapperComponent,
    LeftNavigationComponent,
    TermsConditionComponent,
    MainpageComponent,
    MapHomeComponent,
    ReachUsComponent,
    CrossComponent,
    PurchaseReportsComponent,
    WelcomePinkertonComponent,
    CreditBalanceComponent,
    CreditsComponent,
    ProfileAccountSettingComponent,
    ChangePasswordComponent,
    InformationOverviewComponent,
    CartComponent, SampleReportCartComponent, PurchasedReportsComponent, OrderConfirmationComponent, GetSampleReportsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSliderModule,
    NgxDatatableModule,
    CarouselModule.forRoot(),
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TypeaheadModule.forRoot()

  ],
  providers: [BsDropdownModule, TabsetConfig],schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class MainModule { }

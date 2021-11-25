import { NgModule,APP_INITIALIZER,Injector } from '@angular/core';
import { HttpClient, HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { HttpErrorInterceptor } from './services/httpError.interceptor';
import { MsalModule } from '@azure/msal-angular';


// import { HomeComponent } from './home/home.component';
// import { AccountWrapperComponent } from './accountDetails/account-wrapper/account-wrapper.component';
// import { LoginComponent } from './accountDetails/login/login.component';
// import { SignUpComponent } from './accountDetails/sign-up/sign-up.component';
// import { ForgotPasswordComponent } from './accountDetails/forgot-password/forgot-password.component';
// import { CreatePasswordComponent } from './accountDetails/create-password/create-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserModule } from '@angular/platform-browser';
import { AlertComponent } from './modules/shared/components/alert/alert.component';
import { Configuration } from 'msal';
import { msalConfig } from '../environments/environment';
import { SharedModule } from './modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RequestIntercepterService } from './services/request-intercepter.service';
import { EmailConfirmComponent } from './modules/email-confirm/email-confirm.component';
// import { MapOnHomeComponent } from './map-on-home/map-on-home.component';
areCookiesEnabled();
function areCookiesEnabled() {
  try {
    document.cookie = 'cookietest';
    var cookiesEnabled = document.cookie.indexOf('cookietest') !== -1;
    if(cookiesEnabled){
    localStorage.setItem("cookiesEnabled", "true")
    }
  } catch (e) {
    localStorage.setItem("cookiesEnabled", "false")
  }
}

function getMsalConfig() {
  let config: Configuration;
  if (localStorage.getItem('AuthType')) {
    if (msalConfig[localStorage.getItem('AuthType')]) {
      config = msalConfig[localStorage.getItem('AuthType')];
     }
  }
  return config;
}

@NgModule({

  declarations: [
    AppComponent,
    AlertComponent,
    EmailConfirmComponent

    //HomeComponent,
    //AccountWrapperComponent,
    //LoginComponent,
    //FooterComponent,
    //SignUpComponent,
    //LeftWrapperComponent,
    //ForgotPasswordComponent,
    //CreatePasswordComponent,
    //PageNotFoundComponent,
   // MapOnHomeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    MsalModule.forRoot(getMsalConfig()),
  ],
  exports: [
    MsalModule,
  ],
  // providers: [
  // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  // ,],
  bootstrap: [AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestIntercepterService,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },]
})
export class AppModule {
 }

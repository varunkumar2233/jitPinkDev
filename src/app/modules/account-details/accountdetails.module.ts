import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountWrapperComponent } from './components/account-wrapper/account-wrapper.component';
import { LoginComponent } from './components/login/login.component';

import { FooterComponent } from '../footer/footer.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountDetailsRoutingModule } from './accountdetails-routing.module';

@NgModule({
	declarations: [AccountWrapperComponent,FooterComponent,LoginComponent],
	exports: [AccountWrapperComponent],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  HttpClientModule,
	  AccountDetailsRoutingModule
	]
  })
export class AccountDetailsModule {
  constructor() {
  }
}

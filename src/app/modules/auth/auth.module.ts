import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BroadcastService, MsalModule } from '@azure/msal-angular';
//import { TranslateModule } from '@ngx-translate/core';
import { Configuration } from 'msal';
import { msalConfig } from '../../../environments/environment';
import { SharedModule } from '../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LogoutComponent } from './components/logout/logout.component';
import { MsalAuthComponent } from './components/msal-auth/msal-auth.component';
import { AuthService } from './service/auth.service';
//import { DialogModule } from 'primeng/dialog';
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
  declarations: [MsalAuthComponent, LogoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    //TranslateModule,
    //DialogModule,
    AuthRoutingModule,
    SharedModule,
    MsalModule.forRoot(getMsalConfig()),
  ],
  exports: [
    MsalModule,
  ],
  providers: [BroadcastService,AuthService],
})
export class AuthModule {
}

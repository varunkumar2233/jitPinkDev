import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogoutComponent } from './components/logout/logout.component';
import { MsalAuthComponent } from './components/msal-auth/msal-auth.component';

const routes: Routes = [
  { path: '', redirectTo: 'msal', pathMatch: 'full' },
  { path: 'msal', component: MsalAuthComponent },
  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

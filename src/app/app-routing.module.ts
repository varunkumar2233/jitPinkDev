import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfirmComponent } from './modules/email-confirm/email-confirm.component';
import { MainModule } from './modules/main/main.module';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: 'home',
		loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule)
	},
	{
		path: 'auth',
		loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./modules/account-details/accountdetails.module').then((m) => m.AccountDetailsModule)
	},
	{
		path: 'confirmEmail',
		component: EmailConfirmComponent
	},
	// {
	// 	path: 'signup',
	// 	loadChildren: () => import('./modules/sign-up/signup.module').then((m) => m.SignUpModule)
	// },
	{
		path: 'main',
		loadChildren: () => import('./modules/main/main.module').then((m) => m.MainModule),canActivate: [AuthGuard]
	},

	{ path: '**', redirectTo: 'main/pageNotFound' },
	{ path: 'main/pageNotFound', component: PageNotFoundComponent }
	
	//{ path: 'pageNotFound', component: PageNotFoundComponent },
//	{ path: 'pageNotFound', component: PageNotFoundComponent }
	// {
	// 	path: 'msal',
	// 	loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
	// },
];



// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'login', component: AccountWrapperComponent },
//   { path: 'signup', component: SignUpComponent },
//   { path: 'forgotpassword', component: ForgotPasswordComponent },
//   { path: 'createPassword', component: CreatePasswordComponent },
//   // { path: 'home', component: WrapperComponent },

//   {
//     path: 'main', loadChildren: () => import(`./main/main.module`).then(
//       module => module.MainModule
//     )
//   },

//   // otherwise redirect to home,
 //  { path: 'pageNotFound', component: PageNotFoundComponent },
 //  { path: '**', redirectTo: 'pageNotFound' }
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }






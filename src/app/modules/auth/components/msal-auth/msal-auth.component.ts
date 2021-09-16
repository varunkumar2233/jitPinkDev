import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { environment, services, b2cPolicies, mockUpSecurityKey } from '../../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { SharedService } from 'src/app/modules/shared/services/shared-service.service';
import { debug } from 'console';
	
@Component({
	selector: 'app-msal-auth',
	templateUrl: './msal-auth.component.html',
	styleUrls: ['./msal-auth.component.css'],
})
export class MsalAuthComponent implements OnInit {
	public currentLoggedInUser: string;
	public currentLoggedInUserRole: string;
	public resetFlowSuccess = false;
	public IsAuthProcess = false;
	public userType: string;
	public application: string;
	public userDisabled = false;
	public userDisabledByIp = false;
	public visibleDialog: boolean;
	public userName: any;
	private isActive = new Subject();
	get ENVIRONMENT() {
		return environment;
	}
	constructor(
		private activatedRoute: ActivatedRoute,
		private msalService: MsalService,
		private broadcastService: BroadcastService,
		private http: HttpClient,
		private authService:AuthService,
		private sharedservice:SharedService
	) {
		//this.validateLoginStatus(); // temprary

			
		sharedservice.startLoading();
		this.resetFlowSuccess = false;
		this.msalService.handleRedirectCallback((authError) => {
			if (authError) {
				return;
			}
		});

		this.broadcastService.subscribe('msal:loginSuccess', (success) => {
			if (success.idToken.claims['tfp'] === b2cPolicies.names.resetPassword) {
				this.resetFlowSuccess = true;
				setTimeout(() => {// ths condition required for e-commerce flow.
					const userType = localStorage.getItem('AuthType');
					localStorage.clear();
					localStorage.setItem('AuthType', userType);
					//alert(2);
					let loginRequest;
					loginRequest = {
						scopes: b2cPolicies.scopes.b2cScopes,
					};
					this.msalService.logout();
					sharedservice.startLoading();
					//this.visibleDialog = false;// TT
					this.msalService.loginRedirect(loginRequest);
					
					//localStorage.setItem('CaseNumber', profileCode);
					//return this.msalService.logout();
				}, 1000);
			} else {
				
				this.resetFlowSuccess = false;;
				this.IsAuthProcess = true;
			    
					let scopes;
					let loginHint;
					if (this.checkAuthType()) {
						scopes = b2cPolicies.scopes.b2cScopes;
						loginHint = success.account.idToken.emails[0];
					} else {
						scopes = ['user.read', 'User.ReadBasic.All'];
						loginHint = success.account.userName;
					}
					const loginRequest = {
						scopes: scopes,
						loginHint: loginHint,
					};
					this.msalService.acquireTokenSilent(loginRequest);
			}
		});

		// For Reset Password FLow
		this.broadcastService.subscribe('msal:loginFailure', (error) => {
			if (error.errorMessage.indexOf('AADB2C90118') > -1) {
				this.msalService.loginRedirect(b2cPolicies.authorities.resetPassword);
			} else if (error.errorMessage.indexOf('AADB2C90091') > -1) { // condition for cancel event .
				this.msalService.loginRedirect(b2cPolicies.authorities.SignIn);
			}
		});

		this.broadcastService.subscribe('msal:acquireTokenSuccess', (accessTokenResponse) => {
			sharedservice.startLoading();
			if (this.checkDescription()) {
				// Forgot or Reset Password Flow
				this.msalService.loginRedirect(b2cPolicies.authorities.resetPassword);
			} else {
				const token = this.checkAccessToken(accessTokenResponse, 'token');
				let userName;
				if (this.checkAuthType()) {
					userName = this.checkAccessToken(accessTokenResponse, 'auth');
				} else {
					userName = this.checkAccessToken(accessTokenResponse, 'username');
				}
				const accountName = this.checkAccessToken(accessTokenResponse, 'name');
				
				if (token && userName && accountName) {
					this.storeLocalVal(token, userName, accountName)
				} else {
					this.msalService.logout();
				}
			}
		});

		// For Reset Password FLow
		this.broadcastService.subscribe('msal:acquireTokenFailure', (error) => {
			if (error.errorMessage.indexOf('AADB2C90118') > -1) {
				console.log('Inside Acquire Token Failure If condition');
				this.msalService.loginRedirect(b2cPolicies.authorities.resetPassword);
			}
		});
	
	}
	storeLocalVal(token, userName, accountName) {
			
		const jwtHelper = new JwtHelperService();
		localStorage.setItem('AccessToken', token);
		localStorage.setItem('LoggedInUserName', userName);
		localStorage.setItem('LoggedInName', accountName);
		localStorage.setItem('IsLoggedIn', '1');
		localStorage.setItem('TNC', '1'); // by defauly false
		localStorage.setItem('RefreshToken', btoa(jwtHelper.getTokenExpirationDate(localStorage.getItem('msal.idtoken')).toString()));
		this.initAppAfterLogin(token, userName, accountName);
	}
	checkAuthType() {
		return localStorage.getItem('AuthType') === 'client';
	}
	checkDescription() {
		return localStorage.getItem('msal.error.description') && localStorage.getItem('msal.error.description').startsWith('AADB2C90118');
	}
	checkAccessToken(accessTokenResponse, str) {
			
		if (accessTokenResponse) {
			if (str === 'auth') {
				return accessTokenResponse.account && accessTokenResponse.account.idToken.emails ? accessTokenResponse.account.idToken.emails[0] : '';
			} else if (str === 'username') {
				return accessTokenResponse.account ? accessTokenResponse.account.userName : '';
			} else if (str === 'name') {
				return accessTokenResponse.account ? accessTokenResponse.account.name : '';
			} else if (str === 'token') {
				return accessTokenResponse.accessToken ? accessTokenResponse.accessToken : '';
			}
		}
	}
	ngOnInit(): void {
			
			//this.visibleDialog=false;
		this.userType = localStorage.getItem('AuthType');
		this.application = localStorage.getItem('Application');
		this.activatedRoute.queryParams.subscribe((params) => {
			if (params.username) {
				this.signIn(params.username === 'clientuser' ? '' : params.username);
			}
		});
	}

	initAppAfterLogin(token, userName, accountName) {
			
		this.currentLoggedInUser = `Welcome! ${accountName}`;
		this.storeUserIdentityandRedirect(userName, accountName);
	}

	storeUserIdentityandRedirect(userName, accountName) { // redirect url
		
		this.userName = userName;
		this.validateLoginStatus();
		//window.location.href = environment.postLoginRedirectUri.landing;
		
	}
	private getHttpHeaders() { // for header call.
		
		//const roles = localStorage.getItem('RoleCode');
		const authType = localStorage.getItem('AuthType');
		const accessToken = localStorage.getItem('AccessToken');
		return new HttpHeaders({
			Authorization: `Bearer ${accessToken}`,
			//Role: btoa(roles),
			AuthType: authType,
		});
	}

	public signIn(userName) {
		
		let loginRequest;
		
		loginRequest = {
			scopes: b2cPolicies.scopes.b2cScopes,
		};
		this.sharedservice.startLoading();
		//this.visibleDialog = false;
		localStorage.clear();
		localStorage.setItem('AuthType', this.userType);
		this.msalService.loginRedirect(loginRequest);
	}

	/// this function will use to validate user click will use later
	validateLoginStatus() {
		
		const authType = localStorage.getItem('AuthType');
		const accessToken = localStorage.getItem('AccessToken');
		var header = {
			headers: new HttpHeaders()
			  .set('Authorization',  `Bearer ${accessToken}`)
		  }
	  
		this.authService.getUserInfo(header).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
			console.log(res)
			if (!res.isError) {
				
				localStorage.setItem('TNC', !res.has_agreed_tos ? '0' : '1'); // true.
				if(!res.has_agreed_tos)
				{
					window.location.href = environment.postLoginRedirectUri.termscondition;
				}
				else
				{
				window.location.href = environment.postLoginRedirectUri.landingMain;
				console.log('success getUserInfo api');
				}
			  //this.successMsg = true
			}
		  }, (err) => {
			console.log('error in getUserInfo api');
		  });
		// 
		// const accessToken = localStorage.getItem('AccessToken');
		// let setHeaders = new HttpHeaders({
		// 	Authorization: `Bearer ${accessToken}`,
		// 	//AuthType: authType
		// })
		// 
		// let options = { headers: setHeaders };
		// this.http
		// 	.post<any>(`${environment.apiUrl}/user/user-info/`, options)
		// 	.subscribe(
		// 		(userInfo: any) => {
		// 			alert('yes');
		// 			//localStorage.setItem('userID',btoa(userInfo.data.userID));
		// 			window.location.href = "";//environment.postLoginRedirectUri.gam + btoa(userRoleInfo.data.vendorId);
		// 		},
		// 		(err) => {
		// 			console.log('Unable to user-info service');
		// 		}
		// 	);
	}
}

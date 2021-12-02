import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsalService } from '@azure/msal-angular';
import { userOfflineTimeOut, environment, services, b2cPolicies } from '../../environments/environment';
import { BehaviorSubject, defer, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertServiceService } from '../modules/shared/services/alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessTokenSubject = new BehaviorSubject<any>('');
  public accessToken = this.accessTokenSubject.asObservable();
  private accountInfo;

  IsUserAuthenticated: any;
  IsUserAuthenticatedSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private msalService: MsalService,
    private alertServiceService: AlertServiceService
  ) { 
  }

  public getToken(): string {
    
    return localStorage.getItem('AccessToken');
  }
  public setAccessToken(): Observable<any> {
    let scopes;
    if(localStorage.getItem('AuthType')=='client'){
      scopes= ['https://pinkertonecommerceb2ctest.onmicrosoft.com/api/demo.read'];
    }
    else{
      scopes= ['user.read','User.ReadBasic.All'];
    }
    const loginRequest = {
      scopes: scopes,
      loginHint: this.accountInfo.idToken.emails[0] 
    };
    const currentDate = new Date();
    const addedHours = new Date().setHours(currentDate.getHours()+1);
    const newExpDate=new Date(addedHours);

    return defer(() => this.msalService.acquireTokenSilent(loginRequest).then(
      (accessTokenResponse: any) => {
        localStorage.setItem('LoggedInUserName', localStorage.getItem('authType')=='client'? accessTokenResponse.account.idToken.emails[0]:accessTokenResponse.account.userName);
        localStorage.setItem('AccessToken', accessTokenResponse.accessToken);
        localStorage.setItem('LoggedInName', accessTokenResponse.account.name);
        localStorage.setItem('RefreshToken',btoa(newExpDate.toString()));
        localStorage.setItem ('AccessTokenExpireTime', btoa(accessTokenResponse.expiresOn.toString()));
      }, (error: any) => {
        console.log(error);
        this.alertServiceService.error("Session Expired.. Please login again.");
        setTimeout(() => {
          this.logout();
      }, 500);
        //window.location.href = environment.postLoginRedirectUri.landingMain;
        // this.msalService.acquireTokenPopup(loginRequest).then((token)=>{
        //   localStorage.setItem('LoggedInUserName',  localStorage.getItem('authType')=='client'? (token.account ? token.account.idToken.emails[0]:''):(token.account?token.account.userName:''));
        //   localStorage.setItem('AccessToken', token.accessToken);
        //   localStorage.setItem('LoggedInName',  token.account ? token.account.name : '');
        //   localStorage.setItem('RefreshToken',btoa(newExpDate.toString()));
        // });
      }));
  }

  public get isUserLoggedIn(): boolean {
    this.accountInfo = this.msalService.getAccount();
    const accessToken = localStorage.getItem('AccessToken');
    //const expireTime = localStorage.getItem('AccessTokenExpireTime');
   const jwtHelper = new JwtHelperService();
    if (accessToken) {
      if (jwtHelper.isTokenExpired(accessToken)) {
       const expTime = jwtHelper.getTokenExpirationDate(accessToken).getTime();
        const currentTime = new Date().getTime();
        const diff = Math.abs(expTime - currentTime) / 36e5; // Converts the milliseconds to hrs
        if (diff >= userOfflineTimeOut) {
          localStorage.clear();
          this.IsUserAuthenticatedSubject.next(false);
          window.location.reload();
        }
      }
      this.IsUserAuthenticatedSubject.next(!!this.accountInfo);
       return !!this.accountInfo;
    }
    this.IsUserAuthenticatedSubject.next(false);
   return false;
  }

  public getAccountInfo() {
    return this.msalService.getAccount();
  }

  public getLoggedInUserName() {
    return this.accountInfo ? this.accountInfo.userName : '';
  }

  public getLoggenInUserFirstName() {
    return this.accountInfo ? this.accountInfo.name : '';
  }

  public authenticateExternalUsers(username, password) {
    return this.http.post<any>(`${environment.apiUrl}${services.authenticate}`,
      { LoginId: username, Password: password })
      .pipe(map(user => {
        if (user.isError === false) {
          localStorage.setItem('AccessToken', JSON.stringify(user.data.accessToken));
          this.accessTokenSubject.next(JSON.parse(localStorage.getItem('AccessToken')));
        }
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    const authType = localStorage.getItem('authType');
    localStorage.clear();
    this.accessTokenSubject.next(null);
    localStorage.setItem('authType', authType);
    return this.msalService.logout();
  }

  public signIn(userName) {
    let loginRequest;
    const authType=localStorage.getItem('AuthType');
      if(authType=='client'){
         loginRequest = {
          scopes: b2cPolicies.scopes.b2cScopes,
        }; 
      } else{
         loginRequest = {
          scopes: ['user.read','User.ReadBasic.All'],
          loginHint: userName
        }; 
      }
      //When reset password is clicked still the error description will be available in localstorage
      //localStorage.clear(); // temprarily removed.
      localStorage.setItem('AuthType',authType);
    this.msalService.loginRedirect(loginRequest);
  }
}

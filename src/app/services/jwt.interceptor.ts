import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { mockUpSecurityKey } from '../../environments/environment';

import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService
  ) {

   }
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    });

    return next.handle(req);
  }





  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   
  //   // add authorization header with jwt token if available
  //   if (!request.url.includes('code=') && !request.url.includes('/assets/i18n')
  //     && !request.url.includes('api.ipify.org/?format=json')
  //     && !request.url.includes('api.twitter.com/oauth2/token')
  //     && !request.url.includes('youtube/v3/search')
  //     && !request.url.includes('search/tweets.json')
  //   ) {
  //    // const urlWithSecurityKey = request.url ;
  //     //+ '?code=' + mockUpSecurityKey;
  //     // request = request.clone({ url: urlWithSecurityKey
  //     // });
  //   }

  //   if (!request.url.includes('api.twitter.com/oauth2/token') &&
  //     !request.url.includes('youtube/v3/search') &&
  //     !request.url.includes('search/tweets.json')
  //   ) {
  //     if (this.authenticationService.isUserLoggedIn) {
  //       const jwtHelper = new JwtHelperService();
  //       const accessToken = localStorage.getItem('AccessToken');
  //       if (accessToken) {
  //         const parts = accessToken.split('.');
  //         if (parts.length === 3) {
  //           //If token is a valid JWT
  //           if (jwtHelper.isTokenExpired(accessToken)) { // tricky not handling case.
  //             //alert('your token is expired, please close ');
  //             return next.handle(this.setToken(request, accessToken)); //need to handle refresh token case.
  //             //return this.RefreshAccessToken(request, next);
  //           }
  //         } else {
  //           //If other users
  //           let ExpirationDate = new Date(atob(localStorage.getItem('RefreshToken')));
  //           const currentDate = new Date();
  //           const diff = (ExpirationDate.getTime() - currentDate.getTime());
  //           if ((diff / 1000 / 60) <= 4) {
  //             return this.RefreshAccessToken(request, next);
  //           }
  //         }
  //         return next.handle(this.setToken(request, accessToken));
  //       } else {
  //         return next.handle(request);
  //       }
  //     } else {
  //       
  //       return next.handle(this.setToken(request, localStorage.getItem('AccessToken')));//
  //     }
  //     return next.handle(request);
  //   } else {
  //     return next.handle(request);
  //   }
  // }

  // private setToken(request, accessToken) {
  //   const roles = localStorage.getItem('RoleCode');
  //   const authType = localStorage.getItem('AuthType');
  //   return request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${accessToken}`,
  //       //Role: btoa(roles)
  //       //AuthType: authType
  //     }
  //   });
  // }

  // private isRefreshing = false;
  // private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // private RefreshAccessToken(request: HttpRequest<any>, next: HttpHandler) {
  //   const currentDate = new Date();
  //   console.log('Refresh token updated - ' + currentDate);
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);
  //     return this.authenticationService.setAccessToken().pipe(
  //       switchMap((token: any) => {
  //         this.isRefreshing = false;
  //         this.refreshTokenSubject.next(localStorage.getItem('AccessToken'));
  //         return next.handle(this.setToken(request, localStorage.getItem('AccessToken')));
  //       }));
  //   } else {
  //     return this.refreshTokenSubject.pipe(
  //       filter(token => token != null),
  //       take(1),
  //       switchMap(jwt => {
  //         return next.handle(this.setToken(request, jwt));
  //       }));
  //   }
  // }

}

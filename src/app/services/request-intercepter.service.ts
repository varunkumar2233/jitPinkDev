import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
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

export class RequestIntercepterService implements HttpInterceptor {
  
  constructor(
    private authenticationService: AuthenticationService
  ) { 
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//alert('interceptor calling.');
    //const accessToken = localStorage.getItem('AccessToken');

    // const headerInfo = {
    //   headers: new HttpHeaders()
    //     .set('Authorization',  `Bearer ${accessToken}`)
    // }

    if (this.authenticationService.isUserLoggedIn) {
      const jwtHelper = new JwtHelperService();
      const accessToken = localStorage.getItem('AccessToken');
      if (accessToken) {
        const parts = accessToken.split('.');
        if (parts.length === 3) {
          //If token is a valid JWT
          if (jwtHelper.isTokenExpired(accessToken)) {
            return this.RefreshAccessToken(request, next);
          }
        } else {
          //If other users
          let ExpirationDate = new Date(atob(localStorage.getItem('RefreshToken')));
          const currentDate = new Date();
          const diff = (ExpirationDate.getTime() - currentDate.getTime());
          if ((diff / 1000 / 60) <= 4) {
            return this.RefreshAccessToken(request, next);
          }
        }
        return next.handle(this.setToken(request, accessToken));
      } else {
        return next.handle(request);
      }
    }
    else {

      // token not present case // code need to write redirect login.
      return next.handle(request);
    }
    // token not present case
    return next.handle(request);
  }

   setToken(request, accessToken) {
    //const roles = localStorage.getItem('RoleCode');
    //const authType = localStorage.getItem('AuthType');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        //Role: btoa(roles),
        //AuthType: authType
      }
    });
  }
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  RefreshAccessToken(request: HttpRequest<any>, next: HttpHandler) {
    const currentDate = new Date();
    console.log('Refresh token updated - ' + currentDate);
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authenticationService.setAccessToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(localStorage.getItem('AccessToken'));
          return next.handle(this.setToken(request, localStorage.getItem('AccessToken')));
        }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.setToken(request, jwt));
        }));
    }
  }
}

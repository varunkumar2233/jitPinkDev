import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   // const currentUser = (localStorage.getItem('LoggedInUserNameE') ? localStorage.getItem('LoggedInUserNameE') : '');
    const accessToken = (localStorage.getItem('AccessToken') ? localStorage.getItem('AccessToken') : '');
    const toc = (localStorage.getItem('TNC') ? localStorage.getItem('TNC') : '');

    if (accessToken) {
       if (toc && (toc == '0') && (state.url!= '/main/terms-condition')) { // false.
        window.location.href = environment.postLoginRedirectUri.termscondition;
        return true;
       }

      else if (state.url == '/main/terms-condition') {
        return true;
      }
      else if (state.url== '/main/welcome-pinkerton') {
        return true;
       }
      else
      {
        //window.location.href = environment.postLoginRedirectUri.landingMain;
        return true;
      }
    }
    else
    {
    window.location.href = environment.postLoginRedirectUri.landingHome;
    return false;
    }
    // redirect to login -- if token not present.
  }
}

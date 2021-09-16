import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { mockUpSecurityKey } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
  // getUserInfo(payload) {
  //   return this.http.post(`${environment.apiUrl}${environment.apiUrl}`, '');
  // }

  getUserInfo() {
    return this.http.get(`${environment.userInfo}`);
  }
  checkUserTermsAgreement(header)
  {
    return this.http.get(`${environment.userInfo}`,header);
  }
  register(request) {
    // include recaptcha token as header
    return this.http.post(`${environment.register}`,request, {
      headers: { 'x-recaptcha-token': request.recaptcha }
    });
  }
}

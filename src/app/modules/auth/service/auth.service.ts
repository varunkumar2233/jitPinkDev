import { Injectable } from '@angular/core';
import { EcommerceServiceUrl } from '../auth-constant';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { mockUpSecurityKey } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  // getUserInfo(payload) {
  //   return this.http.post(`${environment.apiUrl}${environment.apiUrl}`, '');
  // }
  getUserInfo(header) {
    return this.http.get(`${environment.userInfo}`,header);
  }
}

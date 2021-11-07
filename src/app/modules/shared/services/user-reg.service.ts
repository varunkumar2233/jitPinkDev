import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRegService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}user/create/`, user);
  }
  getUserInfo() {

    return this.http.get(`${environment.userInfo}`);
  }
  termsAndConditions() {
    return this.http.post(`${environment.userAcceptTAndC}`, '');
  }
  changePassword(request) {
    return this.http.post(`${environment.changePassword}`, request);

  }
  getInContact(request) {
    return this.http.post(`${environment.getinContact}`, request);

  }
  updateProfile(request) {
    return this.http.put(`${environment.updateProfile}`, request);
  }

  getReportCreditPurchaseHistory() {
    return this.http.get(`${environment.getReportCreditPurchaseHistory}`);
  }

  getReportCreditBalance() {
    return this.http.get(`${environment.getReportCreditBalance}`);
  }

  updateCreditBalance(request) {
    return this.http.post(`${environment.updateCreditByOne}`, request);
  }
}
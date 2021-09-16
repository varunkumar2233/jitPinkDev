import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loading = false;
  loadingStatus: Subject<boolean> = new Subject();

  constructor() {
  }

  get _loading(): boolean {
    return this.loading;
  }

  // Function to set page loader value
  set _loading(value) {
    this.loading = value;
    this.loadingStatus.next(value);
  }

  // Function to start page loader
  startLoading() {
    this._loading = true;
  }

  // Function to stop page loader
  stopLoading() {
    this._loading = false;
  }
  get currentLoggedInUser() {
    let user = '';
    if (localStorage.getItem('LoggedInUserName')) {
      user = localStorage.getItem('LoggedInUserName');
    }
    return user;
  }
}

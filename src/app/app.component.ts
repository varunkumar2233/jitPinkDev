import { Component, OnInit } from '@angular/core';
import { Alert } from './modules/shared/models/alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isConsented: boolean = false;
  isEnablaedCookies:Boolean = false;
  constructor() {
      
  }
  ngOnInit(): void {
    this.isEnablaedCookies =  Boolean(localStorage.getItem("cookiesEnabled"))

    let cookieStored:string = sessionStorage.getItem("dataSourceCookie");
      if(cookieStored){
          this.isConsented = true;
      }else if(location.pathname == "/home"){
        this.isConsented = false;
      }else if(location.pathname == "/main"){
        this.isConsented = true;
      }
  }

  reloadme(){
      window.location.reload();
  }
  getCookie(name: string) {
      let ca: Array<string> = document.cookie.split(';');
      let caLen: number = ca.length;
      let cookieName = `${name}=`;
      let c: string;
      for (let i: number = 0; i < caLen; i += 1) {
          c = ca[i].replace(/^\s+/g, '');
          if (c.indexOf(cookieName) == 0) {
              return c.substring(cookieName.length, c.length);
          }
      }
      return '';
  }


  private deleteCookie(name) {
      this.setCookie(name, '', -1);
  }

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
      let d:Date = new Date();
      d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
      let expires:string = `expires=${d.toUTCString()}`;
      let cpath:string = path ? `; path=${path}` : '';
      document.cookie = `${name}=${value}; ${expires}${cpath}`;
      console.log("document.cookie")
      console.log(document.cookie)
      sessionStorage.setItem('dataSourceCookie', document.cookie);
      this.isConsented = true;
      console.log(this.isConsented)
  }

  private consent(isConsent: boolean, e: any) {
      if (!isConsent) {
          return this.isConsented;
      } else if (isConsent) {
          this.setCookie("COOKIE_CONSENT", '1', 2);
          this.isConsented = true;
          e.preventDefault();
      }
  }
}
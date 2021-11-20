import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isConsented: boolean = false;

  constructor() {
      this.isConsented = this.getCookie("COOKIE_CONSENT") === '1';
  }
  ngOnInit(): void {
    this.getCookie("COOKIE-CONSENT-NAME");
    console.log("this.isConsented")
    console.log(this.isConsented)

  }
  getCookie(name: string) {
      let ca: Array<string> = document.cookie.split(';');
      let caLen: number = ca.length;
      let cookieName = `${name}=`;
      let c: string;
      console.log(ca)
      console.log(caLen)
      console.log(cookieName)
      console.log(c)
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
      console.log(document.cookie)
      console.log(document.cookie)
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
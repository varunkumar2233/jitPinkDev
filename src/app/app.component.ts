import { Component, OnInit } from '@angular/core';
import { Alert } from './modules/shared/models/alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isConsented: boolean = false;
  constructor() {

  }
  ngOnInit(): void {
    this.checkCookie()
  }
  setCookie(cname,cvalue,exdays) {

    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + window.location.origin+"/"+cvalue + ";" + expires + ";path=/";
    this.isConsented = true;
  }
  
  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  checkCookie() {
    let user = this.getCookie("username");
    if(user == ""){
      this.isConsented = false;
    }else{
      this.isConsented = true;
    }

  }
}
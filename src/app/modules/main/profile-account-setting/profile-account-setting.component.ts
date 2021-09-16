import { Component, OnInit, Renderer2 } from '@angular/core';
import { TabsetConfig } from 'ngx-bootstrap/tabs';
export function getTabsetConfig(): TabsetConfig {
  return Object.assign(new TabsetConfig(), { type: 'tabs', isKeysAllowed: false, vertical: true });
}
@Component({
  selector: 'app-profile-account-setting',
  templateUrl: './profile-account-setting.component.html',
  styleUrls: ['./profile-account-setting.component.scss'],
  providers: [{ provide: TabsetConfig, useFactory: getTabsetConfig }]
})



export class ProfileAccountSettingComponent implements OnInit {
  showInformation: boolean = true;
  showpaymentMethod: boolean = false;
  showchangePassword: boolean = false;
  status: boolean = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  informationOverview(event: any, className: string){
   const hasClass = event.target.classList.contains(className);
    this.renderer.addClass(event.target, className);
    if(hasClass) {
      this.renderer.removeClass(event.target, className);
    } else {
      this.renderer.addClass(event.target, className);
    }
    this.showInformation = true;
    this.showchangePassword = false;
    this.showpaymentMethod = false;
  }

  changePassword(){
    this.showInformation = false;
    this.showchangePassword = true;
    this.showpaymentMethod = false;
  }
  paymentMethod(){
    this.showInformation = false;
    this.showchangePassword = false;
    this.showpaymentMethod = true;
  }

}

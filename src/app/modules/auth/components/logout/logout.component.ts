import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment, services, mockUpSecurityKey } from '../../../../../environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent implements AfterViewInit, OnDestroy {

  private userType: string;
  private application: string;
  private profileCode: string;
  // @ViewChild('logoutMessage', { read: TemplateRef })
  // logoutMessage: TemplateRef<any>;
  
  constructor(
    private msalService: MsalService,
    private http: HttpClient,
  ) { 
  // const getlocalVal = sessionStorage.getItem('IdNotMatch');
  //   if (getlocalVal){
  //      this.triggerPopup();
  //   }
  }
  // triggerPopup() {
  //   this.dialogService.popOut({
  //     popOutTitle: 'Message',
  //     popOutContent: this.logoutMessage,
  //     width: 700,
  //     position: 'CENTER',
  //     showBackDrop: true
  //   }).subscribe();
  // }
  // onCancelClick(instance) {
  //   sessionStorage.remove('IdNotMatch');
  //   instance.closeCallback();
  // }
  ngAfterViewInit() {
    this.userType = localStorage.getItem('AuthType');
    this.logout();
  }

  logout() {
         localStorage.clear();
         localStorage.setItem('AuthType', this.userType);  
         return this.msalService.logout();
  }
  ngOnDestroy(): void {
     sessionStorage.remove('IdNotMatch');
  }
}

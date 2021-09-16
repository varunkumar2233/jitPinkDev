import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/modules/shared/services/shared-service.service';
import { HomeService } from '../../services/home.service';
import { AlertServiceService } from '../../../shared/services/alert-service.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private isActive = new Subject();
  private userType: string;
  public isUserLoggedin : boolean=false;
  private accessToken : string;
  private loggedInUserName : string;
  constructor(private router: Router,
  private homeservice : HomeService,
  private sharedService: SharedService,
  private alert_service: AlertServiceService) { }

  ngOnInit(): void {
    this.accessToken = localStorage.getItem('AccessToken')
   // this.loggedInUserName = localStorage.getItem('LoggedInNameE')
    this.checkUserLoggedInStatus();
  }
  checkUserLoggedInStatus()
  {
    
    if(this.accessToken)
    {
      this.validateLoginStatus();
    }
    // else
    // {
    //   window.location.href = environment.postLoginRedirectUri.landingHome;
    // }
  }
  SingnIn()
  {

    localStorage.clear();  // temprary remove check.
    this.userType = 'client'; // for B2C
    localStorage.removeItem('AuthType');
    localStorage.setItem('AuthType', this.userType);
    this.router.navigateByUrl(`/auth?username=${'clientuser'}`, { skipLocationChange: true });

    // if (this.accessToken) {  // tricky condiition need to look.
    //  this.validateLoginStatus();
    //   // if (environment && environment.production === true) {
    //   //   window.location.href ='http://google.com';
    //   // }
    // }
    // else
    // {
    
    // }
  }
  SingnUp()
  {
    //this.router.navigate(['/home/signup']);
    //this.router.navigate([`client-setup/overview/`]);
    this.router.navigateByUrl('/home/signup', { skipLocationChange: false });
  }
  validateLoginStatus() {
		var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.accessToken}`)
    };
    
    this.sharedService.startLoading();
		this.homeservice.checkUserTermsAgreement(header).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
			if (!res.isError) {
				if(!res.has_agreed_tos)
				{
           this.sharedService.stopLoading();
           this.router.navigate(['main/terms-condition']);
				}
        else
        {
        this.sharedService.stopLoading();
				window.location.href = environment.postLoginRedirectUri.landingMain;
				console.log('success getUserInfo api');
        }
			}
		  }, (err) => {
//        this.alert_service.error('error');


localStorage.clear();  // temprary remove check.
this.userType = 'client'; // for B2C
localStorage.removeItem('AuthType');
localStorage.setItem('AuthType', this.userType);


        this.sharedService.stopLoading();
		  });
	}
}

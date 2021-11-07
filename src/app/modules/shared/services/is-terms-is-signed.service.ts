import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { HomeService } from '../../home/services/home.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IsTermsIsSignedService {
  private userType: string;
  public isUserLoggedin: boolean = false;
  private accessToken: string;
  constructor(private router: Router,
    private homeservice: HomeService) { }

 public validateLoginStatus() {
    var header = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
    };
    this.homeservice.checkUserTermsAgreement(header).subscribe((res: any) => {
      if (!res.isError) {
        if (!res.has_agreed_tos) {
          this.router.navigate(['main/terms-condition']);
        }
      }
    }, (err) => {
      localStorage.clear();  // temprary remove check.
      this.userType = 'client'; // for B2C
      localStorage.removeItem('AuthType');
      localStorage.setItem('AuthType', this.userType);
    });
  }
}

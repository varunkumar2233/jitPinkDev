import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './services/home.service';

@Injectable({
  providedIn: 'root'
})
export class IfTermsAcceptedService {

  constructor(private homeService: HomeService, private router: Router) {
  }

  ifTermsAccepted() {
    this.homeService.getUserInfo().subscribe((res: any) => {
      if (!res.has_agreed_tos) {
        this.router.navigate(['main/terms-condition']);
      }
    });
  }
}

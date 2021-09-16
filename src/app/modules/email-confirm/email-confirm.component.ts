import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AlertServiceService } from '../shared/services/alert-service.service';
import { SharedService } from '../shared/services/shared-service.service';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss']
})
export class EmailConfirmComponent implements OnInit {

  status: string = 'Verifying code...'
  hasError : boolean= false;
  email : string = '';

  private http: HttpClient;

  constructor(private route: ActivatedRoute,
    private alert_service : AlertServiceService,
    private shared_service : SharedService,
    private router: Router,
    private backend: HttpBackend) {

      this.http = new HttpClient(this.backend)
    }

  ngOnInit(): void {
    //this.email = "two way Binding";
    this.useConfirmationCode();
  }

  async onSubmit(email) {
    if(email=="")
    {
      this.alert_service.error("enter email");
      return false;
    }
    // if(!this.isEmail(email))
    // {
    //   this.alert_service.error("enter valid email");
    //   return false;
    // }
    //this.submitted = true;
          this.shared_service.startLoading();
          //var email = "tanuj.khurana@pinkerton.com";

      try {
        const res = await this.http.post(environment.sendConfermationEmail, { email }).toPromise()
        if (res) {
               this.shared_service.stopLoading();
               this.alert_service.success("Confirmation Code sent succesfully to your email");

             } else {
               this.shared_service.stopLoading();
               this.alert_service.error("Unable to sent Confirmation code");
             }
      }
      catch (e) {
        this.alert_service.error('Unable to sent Confirmation code');
        this.shared_service.stopLoading();
        return;
      }

  }

  isEmail(search:string):boolean
    {
        var  serchfind:boolean;
        var reqexp = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
        serchfind = reqexp.test(search);

        //console.log(serchfind)
        return serchfind
    }


  async useConfirmationCode() {
    // get confirmation code
    const params = await this.route.queryParamMap.pipe(first()).toPromise()
    const code = params.get('confirmation_code')
    if (!code) {
      this.status = 'No confirmation code provided.'
      return
    }

    // send confirmation code to server
    try {
      const res = await this.http.post(environment.emailConfirmUrl, { code }).toPromise();
      this.status = 'Email confirmed, redirecting to login page...'
      localStorage.clear();  // temprary remove check.
      localStorage.removeItem('AuthType');
      localStorage.setItem('AuthType', 'client');
      this.router.navigateByUrl(`/auth?username=${'clientuser'}`, { skipLocationChange: true });
    }
    catch (e) {
      this.alert_service.error('Invalid confirmation code.');
      this.hasError = true;
      this.status = 'Invalid confirmation code.'
      this.shared_service.stopLoading();
      console.error(e)
      return
    }
  }
}

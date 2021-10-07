import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HomeService } from '../../../services/home.service';
import { environment } from '../../../../../../environments/environment';
import { AlertServiceService } from '../../../../shared/services/alert-service.service';
import { SharedService } from '../../../../shared/services/shared-service.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ReCaptchaV3Service } from 'ngx-captcha';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  isUserLoggedin = false;
  private userType: string;
  private isActive = new Subject();
  private accessToken: string;

  isSignUpClicked: boolean = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Mexico];
  public readonly siteKey = "6LcXPzIcAAAAADL_C4eIRc1TLJ39kaAv6hnsqcZR";
  recaptchaToken: string;
  badge: string = 'bottomleft'
  scrHeight:any;
  isDisable : Boolean = false;
  // phoneForm = new FormGroup({
  //   phone: new FormControl(undefined, [Validators.required])
  // });

  // changePreferredCountries() {
  //   this.preferredCountries = [CountryISO.India, CountryISO.Canada, CountryISO.Mexico];
  // }
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertServiceService,
    private sharedService: SharedService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {
  }

  ngOnInit() {
    this.getScreenSize();
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: [null, [Validators.required]],
      recaptcha: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'), Validators.minLength(8)]]
      //has_agreed_tos: ['', Validators.required]
    });
    this.accessToken = localStorage.getItem('AccessToken')

    
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    console.log(this.scrHeight);
}

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  SingnIn() {
    localStorage.clear();
    this.userType = 'client';
    localStorage.removeItem('AuthType');
    localStorage.setItem('AuthType', this.userType);
    this.router.navigateByUrl(`/auth?username=${'clientuser'}`, { skipLocationChange: true });

    // const accessToken = localStorage.getItem('AccessToken');
    // const authType = localStorage.getItem('AuthType');
    // if(accessToken && (authType =='client'))
    // {
    //   this.validateLoginStatus();
    //   //window.location.href = environment.postLoginRedirectUri.termscondition;
    // }
    // else{

    // }
  }
  onSubmit() {
    this.isDisable = (this.registerForm.valid ) ? false : true;
    
    // generate recaptcha token
    this.reCaptchaV3Service.execute(this.siteKey, 'signup', (token) => {
      console.log('This is your token: ', token);
      this.recaptchaToken = token;
    }, {
      useGlobalDomain: false
    });

    if(this.registerForm.valid){
      this.registerForm.patchValue({
        recaptcha: this.recaptchaToken
      })
    }
    this.submitted = true;
    this.isSignUpClicked = true;
    //console.log(this.registerForm.value.phone);
    if (this.registerForm.invalid) {

      this.isSignUpClicked = false;
      return;
    }

    this.registerForm.patchValue({
      phone: this.registerForm.value.phone.e164Number
    })


    this.sharedService.startLoading();
    this.homeService.register(this.registerForm.value)//e164Number
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data.toString())
          localStorage.clear();
          this.isSignUpClicked = false;
          this.alertService.success('Registration successful. We have sent you an email with instructions on how to activate your account.', { keepAfterRouteChange: true });
          this.router.navigate(['../'], { relativeTo: this.route });
          this.sharedService.stopLoading();
        },
        error: error => {
          //error.error["email"]
          this.isSignUpClicked = false;
          this.alertService.error(error.error["email"], { keepAfterRouteChange: true });
          this.alertService.error(error.error["phone"], { keepAfterRouteChange: true });
          if(error.error["detail"]=="User failed the reCAPTCHA test."){
            this.alertService.error("Could not activate your account. Please contact support for help");
          }
          // JSON.stringify(error)
          console.log(error);
          this.sharedService.stopLoading();
          // this.loading = false;
        }
      });
    this.sharedService.stopLoading();
  }

  validateLoginStatus() {

    this.sharedService.startLoading();
    //const authType = localStorage.getItem('AuthType');
    //const accessToken = localStorage.getItem('AccessToken');
    this.homeService.getUserInfo().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      if (!res.isError) {
        if (!res.has_agreed_tos) {
          this.sharedService.stopLoading();
          this.router.navigate(['main/terms-condition']);
        }
        else {
          this.sharedService.stopLoading();
          window.location.href = environment.postLoginRedirectUri.landingMain;
          console.log('success getUserInfo api');
        }
      }
    }, (err) => {
      this.sharedService.stopLoading();
      alert('error in getUserInfo api close brower cache.');
    });
  }
}
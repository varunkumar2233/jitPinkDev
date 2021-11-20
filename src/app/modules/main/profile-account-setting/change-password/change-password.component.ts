import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { takeUntil,first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedService } from '../../../shared/services/shared-service.service';
import { environment } from '../../../../../environments/environment';
import { AlertServiceService } from '../../../shared/services/alert-service.service'
import { UserRegService } from '../../../shared/services/user-reg.service';
import { MustMatch } from '../../../shared/services/passwordvalidatorhelper';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changepassForm: FormGroup;
  submitted = false;
  checkFormValid: boolean = true;
  abc: string;
  passwordVal: string;
  new_password: string;
  newPasswordModel: string;
  confirmNewPasswordModel: string;
  oldPasswordModel: string;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private accountService: UserRegService,
      private alertService: AlertServiceService,
      private sharedService : SharedService
  ) { }

  ngOnInit() {
    this.InitializeForm();
    var abc = "";
    var abczs = console.log(this.passwordVal);
  }

  InitializeForm()
  {
    this.changepassForm = this.formBuilder.group({
    old_password: ['', Validators.required],
    new_password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'), Validators.minLength(8)]],
    password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'), Validators.minLength(8)]]
  },{
      validator: MustMatch('password', 'new_password')
  });
}
  get f() { return this.changepassForm.controls; }

  getFormValueToMatchPassword(FormValue : any)
  {
    // if((this.oldPasswordModel.length>7) &&(this.newPasswordModel.length>7) && this.oldPasswordModel == this.newPasswordModel){
    //   this.alertService.error("Your new password must be different from your current password.");
    //   this.checkFormValid = true;
    // }
  //  if((this.newPasswordModel.length >7) && (this.confirmNewPasswordModel.length>7) && this.newPasswordModel != this.confirmNewPasswordModel)
  //   {
  //     this.alertService.error('New Password and Confirm Password must be match.', { keepAfterRouteChange: true });
  //     return;
  //   }
  }

  abcz(abc: any)
  {
    console.log(abc)
  }
  onSubmit()
  {
    this.checkFormValid = (this.changepassForm.valid) ? true : false;
    this.submitted = true;
    if (this.changepassForm.invalid) {
      this.checkFormValid= true;
      this.alertService.error('New Password and Confirm Password must be match.', { keepAfterRouteChange: true });
      this.checkFormValid= false;
      // this.changepassForm. = false;
        return;
      
    }

    const request = {
  "current_password": this.changepassForm.get('old_password').value,
  "new_password": this.changepassForm.get('new_password').value
  };
    this.sharedService.startLoading();
    this.accountService.changePassword(request)
        .pipe(first())
        .subscribe({
            next: (data) => {
              console.log("data message " +data);
               // localStorage.clear(); 
               this.sharedService.stopLoading();
                this.alertService.success('Password changed successful.', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
              console.log("error message " + error);
              // if(this.oldPasswordModel == this.newPasswordModel)
              // {
              //   this.alertService.error("Your new password must be different from your current password.")
              // }
              this.sharedService.stopLoading();
              // this.alertService.error(  error, { keepAfterRouteChange: true });
            }
        });
  }
}

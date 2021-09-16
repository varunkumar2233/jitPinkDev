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
  }

  InitializeForm()
  {
    this.changepassForm = this.formBuilder.group({
    old_password: ['', Validators.required],
    new_password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'), Validators.minLength(8)]],
    password: ['', Validators.required]
  },{
      validator: MustMatch('password', 'new_password')
  });
}
  get f() { return this.changepassForm.controls; }
  onSubmit()
  {
    
    this.submitted = true;
    if (this.changepassForm.invalid) {
      this.alertService.error('New Password and Confirm Password must be match.', { keepAfterRouteChange: true });
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
               // localStorage.clear(); 
               this.sharedService.stopLoading();
                this.alertService.success('Password changed successful.', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
              
              this.sharedService.stopLoading();
              this.alertService.error(error.error.detail, { keepAfterRouteChange: true });
            }
        });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { takeUntil,first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserRegService } from '../../shared/services/user-reg.service';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../shared/services/shared-service.service';
@Component({
  selector: 'app-reach-us',
  templateUrl: './reach-us.component.html',
  styleUrls: ['./reach-us.component.scss']
})
export class ReachUsComponent implements OnInit {
  reachusForm: FormGroup;
  submitted = false;
  userEmail;
  constructor(
    private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private accountService: UserRegService,
      private alertService: AlertServiceService,
      private sharedService : SharedService
  ) { }

  ngOnInit(): void {
    this.InitializeForm();
  }
  get f() { return this.reachusForm.controls; }

  InitializeForm()
  {

    this.userEmail = localStorage.getItem('LoggedInUserName');
    this.reachusForm = this.formBuilder.group({
    company: ['', Validators.required],
    message: ['', Validators.required],
    name:['',Validators.required],
    email:[this.userEmail,Validators.required]
  });
}


onSubmit()
  {
    
    this.submitted = true;
    if (this.reachusForm.invalid) {
        return;
    }

    const request = {
           "company": this.reachusForm.get('company').value,
           "message": this.reachusForm.get('message').value,
           "name": this.reachusForm.get('name').value,
           "email": this.reachusForm.get('email').value,
  };
    this.sharedService.startLoading();
    this.accountService.getInContact(request)
    
        .pipe(first())
        .subscribe({
            next: (data) => {
               this.sharedService.stopLoading();
                this.alertService.success('successfully saved', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
              
              this.sharedService.stopLoading();
              this.alertService.error(error.error.detail, { keepAfterRouteChange: true });
            }
        });
  }
}

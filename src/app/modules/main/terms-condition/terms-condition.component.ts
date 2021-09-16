import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { UserRegService } from '../../shared/services/user-reg.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared-service.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {
  termsConditionForm: FormGroup;
  isContinueDisabled: boolean = true;
  isTermsDisclaimersAgreed: boolean = true;
  private isActive = new Subject();

  constructor(private fb: FormBuilder,
    private alertService: AlertServiceService,
    private userRegService: UserRegService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.InitializeFormStructure();
  }
  InitializeFormStructure() {
    this.sharedService.startLoading();
    this.termsConditionForm = this.fb.group({
      has_agreed_tos: [false, Validators.required]
    });

    this.userRegService.getUserInfo().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      console.log(res.has_agreed_tos);
      this.isTermsDisclaimersAgreed = res.has_agreed_tos ? res.has_agreed_tos : false;

      this.termsConditionForm.patchValue({
        has_agreed_tos: res.has_agreed_tos
      })

      this.sharedService.stopLoading();
    }, (err) => {
      this.sharedService.stopLoading();
      this.alertService.error('Error while updating terms and condition.');
    });


  }
  termsConditionCheck(obj) {
    this.isContinueDisabled = obj.target.checked ? false : true;
  }

  async continue() {
    if (this.termsConditionForm.controls.has_agreed_tos.value === true && !this.termsConditionForm.invalid) {
      await this.updateTermsAndCondion();
    }
    else {
      return;
    }
  }


  updateTermsAndCondion() {
    this.sharedService.startLoading();
    const accessToken = localStorage.getItem('AccessToken');
    this.userRegService.termsAndConditions().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      console.log(res)
      if (!res.isError) {

        if (res.detail == 'ok') {
          localStorage.setItem('TNC', '1'); // success
          //this.alertService.error('Success.');
          this.router.navigate(['main']);
        }
        else {
          window.location.href = environment.postLoginRedirectUri.landingMain;
          //console.log('success getUserInfo api');
        }
      }
      this.sharedService.stopLoading();
    }, (err) => {
      this.sharedService.stopLoading();
      this.alertService.error('Error while updating terms and condition.');
    });
  }
}

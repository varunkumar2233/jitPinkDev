import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedService } from '../../../shared/services/shared-service.service';
import { environment } from '../../../../../environments/environment';
import { AlertServiceService } from '../../../shared/services/alert-service.service'
import { UserRegService } from '../../../shared/services/user-reg.service';
import { MustMatch } from '../../../shared/services/passwordvalidatorhelper';
//import { ProfileAccountSetting } from '../../../../modules/main/profile-account-setting/service/profile-account-setting.service';

@Component({
  selector: 'information-overview',
  templateUrl: './information-overview.component.html',
  styleUrls: ['./information-overview.component.scss']
})
export class InformationOverviewComponent implements OnInit {
  infoOverviewForm: FormGroup;
  private isActive = new Subject();
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertServiceService,
    private sharedService: SharedService,
    private UserRegService: UserRegService

  ) { }
  get f() { return this.infoOverviewForm.controls; }
  ngOnInit() {

    this.infoOverviewForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')]],
      email: ['', [Validators.required, Validators.email]],

    });

    this.bindInfoOverview();
  }

  bindInfoOverview() {
    const emailControl = this.infoOverviewForm.get('email');
    this.sharedService.startLoading();
    this.UserRegService.getUserInfo().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      if (!res.isError) {
        this.sharedService.stopLoading();
        console.log(res);
        this.infoOverviewForm.patchValue({
          firstName: res.first_name,
          lastName: res.last_name,
          phoneNumber: res.phone,
          email: res.email,
        });
      } else {
        this.sharedService.stopLoading();
      }
    }, (err) => {
      this.sharedService.stopLoading();
    });
    emailControl.disable();
  }

  onSubmit() {
    this.submitted = true;

    if (!this.infoOverviewForm.invalid) {
      this.sharedService.startLoading();
      let objUserProfile = {} as any;
      objUserProfile.first_name = this.infoOverviewForm.get('firstName').value;
      objUserProfile.last_name = this.infoOverviewForm.get('lastName').value;
      objUserProfile.phone = this.infoOverviewForm.get('phoneNumber').value;

      this.UserRegService.updateProfile(objUserProfile).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
        if (!res.isError) {
          this.sharedService.stopLoading();
          this.infoOverviewForm.patchValue({
            firstName: res.first_name,
            lastName: res.last_name,
            phoneNumber: res.phone,
          });
          this.alertService.success("User profile updated successfully.");

        } else {
          this.sharedService.stopLoading();
          this.alertService.error("Unable to update user profile.");
        }
      }, (err) => {
        this.sharedService.stopLoading();
      });

    }
    else {
      this.alertService.error("Please fill required field.");
    }
  }


}

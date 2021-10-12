import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared/services/shared-service.service';
import { AlertServiceService } from '../../shared/services/alert-service.service'
import { CreditBalanceService } from './services/credit-balance.service';
import { UserRegService } from '../../shared/services/user-reg.service';


@Component({
  selector: 'app-credit-balance',
  templateUrl: './credit-balance.component.html',
  styleUrls: ['./credit-balance.component.scss']
})
export class CreditBalanceComponent implements OnInit {
  private isActive: Subject<boolean> = new Subject();
  headers = ["Type", "Amount", "Date", "Download/Preview"];
  temp = [];
  rows = [];
  gdata: any;

  creditBalanceForm: FormGroup;
  OverviewTotalPurchasedQuantity: any;
  OverviewPlatinumQuantity: any;
  OverviewStandardQuantity: any;
  OverviewTotalSavingsAmount: any;

  PlatinumAvailableCredits: any;
  PlatinumTotalCredits: any;
  PlatinumUsedCredits: any;
  PlatinumTotalSavings: any;

  StandardAvailableCredits: any;
  StandardTotalCredits: any;
  StandardUsedCredits: any;
  StandardTotalSavings: any;

  constructor(
    private formBuilder: FormBuilder,
    private CreditBalanceService: CreditBalanceService,
    private UserRegService: UserRegService,
    private alertService: AlertServiceService,
    private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.bindCreditBalance();
    this.bindCreditPurchaseHistory();
  }


  bindCreditBalance() {
    this.sharedService.startLoading();
    this.UserRegService.getReportCreditBalance()
      .pipe(takeUntil(this.isActive))
      .subscribe((res: any) => {
        console.log(res);

        if (res) {

          this.OverviewTotalPurchasedQuantity = res.overview.total_purchased;
          this.OverviewPlatinumQuantity = res.overview.platinum_purchased;
          this.OverviewStandardQuantity = res.overview.standard_purchased;
          // this.OverviewTotalSavingsAmount = res.overview.total_savings;

          this.PlatinumAvailableCredits = res.platinum.available;
          this.PlatinumTotalCredits = res.platinum.purchased;
          this.PlatinumUsedCredits = res.platinum.spent;

          this.StandardAvailableCredits = res.standard.available;
          this.StandardTotalCredits = res.standard.purchased
          this.StandardUsedCredits = res.standard.spent;

          this.sharedService.stopLoading()
        }
        else {
          this.sharedService.stopLoading()
          this.alertService.error("Credit balance details not found.");
        }
      });

  }

  bindCreditPurchaseHistory() {

    this.sharedService.startLoading();
    this.UserRegService.getReportCreditPurchaseHistory()
      .pipe(takeUntil(this.isActive))
      .subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.gdata = res;// JSON.parse(res);
          this.fetch(data => {
            // cache our list
            this.temp = [...data];
            // push our inital complete list
            this.rows = data;
          });

        }
        else {
          this.sharedService.stopLoading()
          this.alertService.error("No purchase history found.");
        }
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.credit_type.toLowerCase().indexOf(val) !== -1 ||
        d.amount.toString().indexOf(val) !== -1 ||
        d.date.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.myFilterTable.offset = 0;
  }

  fetch(cb) {
    const data = this.gdata;//JSON.parse(this.gdata);
    cb(data);
  }

  // gdata = [
  //   {
  //     "credit_type": "Platinum",
  //     "amount": "10",
  //     "date": "01/02/2021"

  //   },
  //   {
  //     "credit_type": "Platinum",
  //     "amount": "10",
  //     "date": "01/02/2021"

  //   },
  //   {
  //     "credit_type": "Standard",
  //     "amount": "10",
  //     "date": "01/02/2021"

  //   },
  //   {
  //     "credit_type": "Platinum",
  //     "amount": "10",
  //     "date": "01/02/2021"

  //   },
  //   {
  //     "credit_type": "Standard",
  //     "amount": "20",
  //     "date": "05/08/2021"
  //   }];

  ngOnDestroy() {
    this.isActive.next(true);
    this.isActive.complete();
  }
}

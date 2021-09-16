import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
//import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedService } from '../../shared/services/shared-service.service';
import { AlertServiceService } from '../../shared/services/alert-service.service'
import { UserRegService } from '../../shared/services/user-reg.service';


@Component({
    selector: 'app-purchase-history',
    templateUrl: './purchase-history.component.html',
    styleUrls: ['./purchase-history.component.scss']
})

export class PurchaseHistoryComponent implements OnInit {

    // private isActive: Subject<boolean> = new Subject();
    // @ViewChild('myTable') myFilterTable: DatatableComponent;

    // headers = ["Type", "Amount", "Date"];
    // temp = [];
    // rows = [];

    // constructor(
    //     private UserRegService: UserRegService,
    //     private alertService: AlertServiceService,
    //     private sharedService: SharedService,) { }

    ngOnInit() {
    }
    // ngOnInit() {
    //     this.bindCreditBalance();
    //     this.fetch(data => {
    //         // cache our list
    //         this.temp = [...data];

    //         // push our inital complete list
    //         this.rows = data;
    //     });
    // }

    // fetch(cb) {

    //     const data = this.gdata;//JSON.parse(this.gdata);
    //     cb(data);
    // }

    // updateFilter(event) {
    //     const val = event.target.value.toLowerCase();

    //     // filter our data
    //     const temp = this.temp.filter(function (d) {
    //         return d.credit_type.toLowerCase().indexOf(val) !== -1 ||
    //             d.amount.toLowerCase().indexOf(val) !== -1 ||
    //             d.date.toLowerCase().indexOf(val) !== -1 || !val;
    //     });

    //     // update the rows
    //     this.rows = temp;
    //     // Whenever the filter changes, always go back to the first page
    //     // this.myFilterTable.offset = 0;
    // }


    // bindCreditBalance() {

    //     //this.sharedService.startLoading();
    //     this.UserRegService.getReportCreditPurchaseHistory()
    //         .pipe(takeUntil(this.isActive))
    //         .subscribe((res: any) => {
    //             console.log(res);
    //             //this.sharedService.stopLoading(); // hides loader
    //             if (res) {
    //                 // console.log(res.purchased.platinum);

    //                 // console.log(res.data);
    //                 // this.departments = res.data;
    //                 //  this.sharedService.stopLoading()
    //             }
    //             else {
    //                 // this.sharedService.stopLoading()
    //                 this.alertService.error(res.messageText);
    //             }
    //         });

    // }

    // gdata = [
    //     {
    //         "credit_type": "Platinum",
    //         "amount": "10",
    //         "date": "01/02/2021"

    //     },
    //     {
    //         "credit_type": "Platinum",
    //         "amount": "10",
    //         "date": "01/02/2021"

    //     },
    //     {
    //         "credit_type": "Standard",
    //         "amount": "10",
    //         "date": "01/02/2021"

    //     },
    //     {
    //         "credit_type": "Platinum",
    //         "amount": "10",
    //         "date": "01/02/2021"

    //     },
    //     {
    //         "credit_type": "Standard",
    //         "amount": "20",
    //         "date": "05/08/2021"
    //     }];
}
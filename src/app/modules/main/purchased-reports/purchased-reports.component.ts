import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared-service.service';
import { MapboxServService } from '../services/mapbox-serv.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { link } from 'fs';

@Component({
  selector: 'app-purchased-reports',
  templateUrl: './purchased-reports.component.html',
  styleUrls: ['./purchased-reports.component.scss']
})
export class PurchasedReportsComponent implements OnInit {

  private isActive = new Subject();
  onPageLoad : boolean;
  rows = [
  ]
  filterTerm: string;
  headers = ["Location/Name", "Type", "Date"];
  constructor(private sharedService: SharedService, private map: MapboxServService,
    private router: Router,
    private alertService: AlertServiceService,) { }

  ngOnInit(): void {
    this.onPageLoad = true;
    this.bindMyReportsData();
  }

  bindMyReportsData() {
    this.sharedService.startLoading();

    this.map.getPurchaseHistory().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      console.log("res")
      console.log(res);
      if (!res.isError) {
        this.myreportList(res);
        this.sharedService.stopLoading();
      }
    }, (err) => {
      console.log('my report api stach trace below');
          console.log(err);
      this.sharedService.stopLoading();
      this.alertService.error('Error while fetching history.');
    });
  }

  myreportList(response) {
    var TempArray = [];
    response.forEach(function (value) {
      TempArray.push(value);
    })

    this.rows = TempArray;
    this.onPageLoad = false;
    //console.log(this.rows);
    // return TempArray;

  }

  displayInvoice(order_id)
  {

    var myRegexp = /(\d+)\D*$/g;
    var match = myRegexp.exec(order_id);
    //this.sharedService.startLoading();

    this.router.navigate([]).then(result => {  window.open( `main/orderConfirmation/?order_id=${order_id}`, '_blank'); });
    // this.map.getDocumentSasUrlByUrl(match[1]).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
    //   if (res.url) {
    //     console.log("res table")
    //     console.log(res)
    //     window.open(res.url, '_blank');
    //   }
    //   this.sharedService.stopLoading();
    // }, (err) => {
    //   this.alertService.error('Error while getting invoice.');
    //   this.sharedService.stopLoading();
    // });

  }

}

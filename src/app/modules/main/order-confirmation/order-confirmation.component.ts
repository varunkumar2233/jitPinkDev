import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from '../../shared/services/shared-service.service';
import { addToCartServie } from '../services/add-to-cart.service';
import { Subscription, Subject } from 'rxjs';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { UserRegService } from '../../shared/services/user-reg.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})

export class OrderConfirmationComponent implements OnInit {
  order_ID: any;
  isActive: Subject<boolean> = new Subject();
  orderList: Array<any> = [];
  paymentData: any;

  orderSummary: any;
  userdetails:any;
  counter: number;
  userNotificationList: any;
  new_Report_count: number;

  constructor(private route: ActivatedRoute,
    private UserRegService: UserRegService,
    private shared_service: SharedService,
    private service: addToCartServie,
    private alert_service: AlertServiceService,
    private notification_Service: NotificationsService

  ) { }

  ngOnInit(): void {

    this.shared_service.startLoading();
    this.route.queryParams.subscribe(params => {
      this.order_ID = params['order_id']
    });
    this.getOrderSummary();
    
    this.shared_service.stopLoading();

    this.UserRegService.getUserInfo().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      if (!res.isError) {
        console.log(res)
        this.userdetails = res;
      }
  });

  }




  getOrderSummary() {
    this.service.getOrderSummary(this.order_ID).pipe(takeUntil(this.isActive)).subscribe(orderSummaryDetails => {
      console.log("orderSummaryDetails")
      console.log(orderSummaryDetails)
      this.orderSummary = orderSummaryDetails;
      this.bindOrderSummaryDetails(orderSummaryDetails);
      this.getNotification();
    });
  }


  getNotification(){
    this.notification_Service.updateNotification();
    console.log("after behaviour subject triggred " + this.new_Report_count)
//     this.notification_Service.getNotificationList().subscribe(data=>{
//       this.new_Report_count = this.userNotificationList[1].new_report_count;
//       console.log("Order confirmation Api call " + this.new_Report_count)
//       this.notification_Service.updateNotification();
//       console.log("after behaviour subject triggred " + this.new_Report_count)
//     //   this.notification_Service.notificationListUrl().pipe(takeUntil(this.isActive)).subscribe((data:any) =>{
//     //   console.log(data);
//     //   data = this.userNotificationList[1].new_report_count; 
//     // }) 
// })
  }

  bindOrderSummaryDetails(req) {
    var reportData = [];
    req.reports.forEach(function (value) { // report data
      reportData.push(
        {
          "id": value.id,
          "address": value.address, // this will change...
          "report_type": value.report_type,
          "country": value.usa,
          "price": value.price
        }
      );
    });

    this.orderList = reportData;

    var payments = {
      "subtotal": req.payment.subtotal,
      "tax": req.payment.tax,
      "total": req.payment.total
    }
    this.paymentData = payments;
    if (this.orderList.length > 0) {
      this.callReportgenrationEndPoints(this.orderList);
    }
  }

  async callReportgenrationEndPoints(reportsObj) {
    for (var i = 0; i < reportsObj.length;) {
      this.service.genrateReport(reportsObj[i].id).toPromise();
      i++;
    }
  }
}

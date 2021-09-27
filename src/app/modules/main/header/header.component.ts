import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
import { CartComponent } from '../cart/cart.component';
import { addToCartServie } from '../services/add-to-cart.service';
import { SharedService } from '../../../modules/shared/services/shared-service.service'
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShopifyService } from '../services/shopify.service';
import { DataProviderService } from '../services/data-provider.service';
import { request } from 'http';
import { WelcomePinkertonComponent } from '../welcome-pinkerton/welcome-pinkerton.component';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  bsModalRef: BsModalRef | undefined;
  cartList: Array<any> = [];
  totalAmount: any;
  itemCount: any;
  standartReportAmount: any;
  platiumReportAmount: any;
  private isActive = new Subject();
  userNotificationList: any;
  numberofUnSeenNotifications: number;
  unReadNotifications: number;
  constructor(private modalService: BsModalService, private router: Router,
    private cart_service: addToCartServie,
    private shared_service: SharedService,
    private alert_service: AlertServiceService,
    private shopify: ShopifyService,
    private servNotification: NotificationsService,
    private date_Provider_Service: DataProviderService) {
    this.date_Provider_Service.getcartData().pipe(takeUntil(this.isActive)).subscribe((data: any) => {
      this.updateBasketAfterAddtoCart(data);
      let elementBtn:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      elementBtn.click();
    });
  }

  openWelcomeScreen() {
    this.modalService.show(WelcomePinkertonComponent, Object.assign({}, { class: 'welcome-popup' }));
  }
  ngOnInit(): void {
    //alert('cart list');
    this.getReportPricesfromShopify();
    setTimeout(() => {
      this.loadCartData();
    }, 1000);

  this.servNotification.getNotificationList().subscribe(data=>{
    this.userNotificationList = data;
    console.log("userNotificationList")
    console.log(this.userNotificationList)
    //const seen = false;
    //this.numberofUnSeenNotifications = this.userNotificationList.filter((obj) => obj.seen === seen).length;
    //console.log(this.numberofUnSeenNotifications);
    //this.unReadNotifications = this.userNotificationList.filter((obj) => obj.seen === seen);
    //console.log(this.unReadNotifications)
  })
    //console.log('cart list data');
    //console.log(this.cartList);
  }
  onClick() {
    window.location.href = environment.logoutUrl;
  }

  loadCartData() {
    this.cart_service.displayCartData().pipe(takeUntil(this.isActive)).subscribe(data => {
      this.myCartList(data);
    });
  }


  updateBasketAfterAddtoCart(data) {
    var duplicateValueTrue = this.cartList.filter(DuplicateRecord => DuplicateRecord.geo_id == data.geo_id)
    if(duplicateValueTrue.length != 0){
      this.alert_service.error('Same value added already');
    } else {
    if (data.report_type === 'standard_credits' || data.report_type === 'platinum_credits') {
      var indexcredit = this.cartList.findIndex(x => x.report_type === data.report_type);
      if (indexcredit > -1) {
        this.cartList.splice(indexcredit, 1);
      }
    }
    //this.cartList.push(data);
    this.cartList.unshift(data);
    this.itemCount = this.cartList.length;
    this.calculateItemSum();
  }
  }

  myCartList(req) {

    var tempArray = [];
    var amount = 0;
    var standardAmount = this.standartReportAmount;
    var platiumAmount = this.platiumReportAmount;
    const distinctReports = req.reports.filter(
      (report, i, arr) => arr.findIndex(r => r.geo_id === report.geo_id) === i
    );
    distinctReports.forEach(function (value) { // report data
      tempArray.push(
        {
          "id": value.id,
          "address": value.address, // this will change...
          "report_type": value.report_type,
          "country": value.usa,
          "lon": value.lon,
          "lat": value.lat,
          "geo_id": value.geo_id,
          "price": value.report_type == 'platinum' ? platiumAmount : standardAmount,
          "quantity": ''
        }
      );
    });
    // credit data.
    var premCred = req.platinum_credits;
    var standCred = req.standard_credits;

    if (standCred != 0) {
      var standareCreditRequest = {
        "id": 0,
        "address": '', // this will change...
        "report_type": 'standard_credits',
        "country": '',
        "lon": '',
        "lat": '',
        "geo_id": '',
        "price": this.getCreditTotalPrice(standCred, 'standard_credits'),
        "quantity": standCred,
        //"testprice": this.getCreditTotalPrice(standCred,'standard_credits')

      };
      tempArray.push(standareCreditRequest);
    }

    if (premCred != 0) {
      var platiumCreditRequest = { // we can show the add to cart data for credits & reports.
        "id": 0,
        "address": '', // this will change...
        "report_type": 'platinum_credits',
        "country": '',
        "lon": '',
        "lat": '',
        "geo_id": '',
        "price": this.getCreditTotalPrice(premCred, 'platinum_credits'),
        'quantity': premCred,
      };
      tempArray.push(platiumCreditRequest);
    }

    this.cartList = tempArray;
    this.itemCount = this.cartList.length;
    this.calculateItemSum();
  }

  deleteReportFromCart(id, type) {
    this.shared_service.startLoading();
    if (type === 'standard_credits' || type === 'platinum_credits') {
      var removeCredObj;
      if (type === 'standard_credits') {
        removeCredObj = {
          "standard_credits": 0
        };
      }
      else {
        removeCredObj = {
          "platinum_credits": 0
        };
      }

      let indexcredit = this.cartList.findIndex(x => x.id === id);
      if (indexcredit > -1) {
        this.cartList.splice(indexcredit, 1);
        this.itemCount = this.cartList.length;
        this.calculateItemSum();
        this.addUpdateCreditToCartDB(removeCredObj);
      }
    }
    else {
      let indexcredit = this.cartList.findIndex(x => x.id === id);
      if (indexcredit > -1) {
        this.cartList.splice(indexcredit, 1);
        this.itemCount = this.cartList.length;
        this.calculateItemSum();
        this.removeItemFromDB(id);
        this.date_Provider_Service.updateCartData('report');
      }
    }
    this.date_Provider_Service.setViewCartDetailData(this.cartList);
    this.shared_service.stopLoading();

    // this.shared_service.startLoading();
    // const request = {
    //  "delete_ids": [id]
    // };
    // this.cart_service.deleteReportFromCart(request).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
    //   if (!res.isError) {
    //     this.cartList = this.cartList.filter(item => item.id !== id);
    //     this.itemCount = this.cartList.length;
    //     this.calculateItemSum();
    //    //this.alert_service.success('item removed from cart');
    //     this.shared_service.stopLoading();
    //   }
    // }, (err) => {

    //   this.shared_service.stopLoading();
    //   this.alert_service.error('Error while deletiing items.');
    // });
  }


  async removeItemFromDB(id) {
    const request = {
      "delete_ids": [id]
    };
    this.cart_service.deleteReportFromCart(request).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      if (!res.isError) {
        this.shared_service.stopLoading();
      }
    }, (err) => {

      this.shared_service.stopLoading();
      this.alert_service.error('Error while deletiing items.');
    });

  }

  async addUpdateCreditToCartDB(reportsdata) {
    this.cart_service.addCreditToCartDB(reportsdata).pipe(takeUntil(this.isActive)).subscribe(data => {
      //console.log(data); // getting reportID after addig item to cart.
    });
  }

  calculateItemSum() {
    var total = 0;
    var creditAmount = 0;
    var amount = 0;
    //var creditAmounts = this.getCreditTotalPrice(1,2);


    for (var i = 0; i < this.cartList.length; i++) {
      // creditAmount =0;
      //creditAmount = this.getCreditTotalPrice(this.cartList[i].quantity,this.cartList[i].report_type);
      //amount = creditAmount ==0 ? parseInt(this.cartList[i].price) : creditAmount;
      total += parseInt(this.cartList[i].price);
    }

    //    this.cartList.forEach(function(val) {
    //     creditAmount = this.getCreditTotalPrice(val.quantity,val.report_type);

    //     total += amount;
    // });
    this.totalAmount = total;
  }
  getReportPricesfromShopify() {
    // const products = await this.shopify.getProducts();
    // this.standartReportAmount = products.find(e => e.handle === `standard-report`).variants[0].price;
    // this.platiumReportAmount = products.find(e => e.handle === `platinum-report`).variants[0].price;

    this.shopify.getProducts().then(data => {
      this.standartReportAmount = data.find(e => e.handle === `standard-report`).variants[0].price;
      this.platiumReportAmount = data.find(e => e.handle === `platinum-report`).variants[0].price;
    });
  }

  getCreditTotalPrice(quantity, credittype) {
    if (credittype === 'standard_credits') {
      if (quantity >= 25 && quantity <= 49) {
        return quantity * 250;

      } else if (quantity >= 50) {
        return quantity * 200;

      } else {
        return quantity * 350;
      }
    }
    else {
      if (quantity >= 25 && quantity <= 49) {
        return quantity * 770;

      } else if (quantity >= 50) {
        return quantity * 615;

      } else {
        return quantity * 1000;
      }
    }
  }

  viewcart() {
    this.date_Provider_Service.setViewCartDetailData(this.cartList);
    this.router.navigate(['main/cart']);
  }
  onNotification_followup(data:any) {
    this.date_Provider_Service.setCartNotificationData(data);
    console.log("setting data")
    console.log(data)
    this.router.navigate(['./main']);
    setTimeout(()=>{                           //<<<---using ()=> syntax
      document.getElementById('report-pane-section').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
 }, 900);
    
  }
}


